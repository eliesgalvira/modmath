/**
 * Euclidean Folding — step generation, geometry computation, and helpers.
 *
 * Shared by both the Framer Motion (v1) and GSAP (v2) visualization pages.
 * Pure functions only — no React imports.
 */

const DEG = Math.PI / 180;
const COS45 = Math.cos(45 * DEG);

// ── View constants ─────────────────────────────────────────────────────────
export const VB_W = 820;
export const VB_H = 620;
export const PIVOT_X = VB_W / 2; // 410
export const PIVOT_Y = VB_H - 60; // 560

const FILL = 0.8;
const LEFT_ANG = 135; // upper-left
const RIGHT_ANG = 45; // upper-right
const LABEL_BEYOND = 30; // px past the arm tip
const MAX_STEPS = 100;

// ── Types ──────────────────────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export interface FoldStep {
  left: number;
  right: number;
  /** Extra quick overlap folds before the swing-out (modulo mode, 0 otherwise). */
  quickFolds: number;
}

export interface FoldSequence {
  steps: FoldStep[];
  gcd: number;
  tooMany: boolean;
}

export interface ArmGeo {
  start: Point;
  end: Point;
  beads: Point[];
  labelPos: Point;
  value: number;
}

export interface VGeo {
  pivot: Point;
  left: ArmGeo;
  right: ArmGeo;
  /** Fading reference line for the original longer arm (Phase 2 after quick folds). */
  bgLine?: { start: Point; end: Point; opacity: number };
}

// ── Step generation ────────────────────────────────────────────────────────

export function generateSteps(
  a: number,
  b: number,
  modulo: boolean,
): FoldSequence {
  if (a <= 0 || b <= 0 || !Number.isInteger(a) || !Number.isInteger(b))
    return { steps: [], gcd: 0, tooMany: false };
  if (a === b)
    return { steps: [{ left: a, right: b, quickFolds: 0 }], gcd: a, tooMany: false };

  const steps: FoldStep[] = [{ left: a, right: b, quickFolds: 0 }];
  let l = a;
  let r = b;

  while (l !== r && l > 0 && r > 0) {
    if (steps.length > MAX_STEPS) return { steps: [], gcd: 0, tooMany: true };

    const sh = Math.min(l, r);
    const lo = Math.max(l, r);

    if (modulo) {
      const k = Math.floor(lo / sh);
      const rem = lo % sh;
      const qf = k - 1;

      if (rem === 0) {
        // Shorter divides evenly — GCD found
        steps.push({ left: sh, right: sh, quickFolds: qf });
        break;
      }

      if (l <= r) r = rem;
      else l = rem;
      steps.push({ left: l, right: r, quickFolds: qf });
    } else {
      if (l <= r) r -= l;
      else l -= r;
      steps.push({ left: l, right: r, quickFolds: 0 });
    }
  }

  const last = steps[steps.length - 1];
  return { steps, gcd: last.left || last.right, tooMany: false };
}

// ── Bead count ─────────────────────────────────────────────────────────────

export function beadCount(len: number): number {
  if (len <= 0) return 0;
  if (len <= 100) return len;
  if (len <= 1_000) return Math.floor(len / 10);
  if (len <= 10_000) return Math.floor(len / 100);
  return Math.floor(len / 1_000);
}

// ── Scale (px per unit) ────────────────────────────────────────────────────

export function computeScale(maxLen: number): number {
  if (maxLen <= 0) return 1;
  const hMax = (PIVOT_X - 20) * FILL;
  const vMax = (PIVOT_Y - 20) * FILL;
  return Math.min(hMax / (maxLen * COS45), vMax / (maxLen * COS45));
}

// ── Point helpers ──────────────────────────────────────────────────────────

/** Point at distance `d` from `o` along math-angle `deg` (0°=right, 90°=up). */
export function pt(o: Point, deg: number, d: number): Point {
  const r = deg * DEG;
  return { x: o.x + d * Math.cos(r), y: o.y - d * Math.sin(r) };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lp(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

// ── Internal builders ──────────────────────────────────────────────────────

function beadPositions(start: Point, end: Point, n: number): Point[] {
  const out: Point[] = [];
  for (let i = 1; i <= n; i++) out.push(lp(start, end, i / n));
  return out;
}

function buildArm(start: Point, end: Point, value: number): ArmGeo {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy);
  const labelPos =
    len > 0
      ? { x: end.x + (dx / len) * LABEL_BEYOND, y: end.y + (dy / len) * LABEL_BEYOND }
      : end;
  return {
    start,
    end,
    beads: beadPositions(start, end, beadCount(value)),
    labelPos,
    value,
  };
}

// ── Static V (resting state for a step) ────────────────────────────────────

export function staticV(left: number, right: number): VGeo {
  const s = computeScale(Math.max(left, right, 1));
  const p: Point = { x: PIVOT_X, y: PIVOT_Y };
  return {
    pivot: p,
    left: buildArm(p, pt(p, LEFT_ANG, left * s), left),
    right: buildArm(p, pt(p, RIGHT_ANG, right * s), right),
  };
}

// ── Fold direction ─────────────────────────────────────────────────────────

export type FoldDir = "left" | "right";

export function foldDir(l: number, r: number): FoldDir {
  return l <= r ? "left" : "right";
}

// ── Phase 1 — overlap fold ─────────────────────────────────────────────────

/**
 * @param left   Current left arm length
 * @param right  Current right arm length
 * @param t      Animation progress 0 → 1
 * @param offset How many shorter-arm-lengths the fold pivot has already
 *               advanced (0 for the first / only fold).
 */
export function phase1(
  left: number,
  right: number,
  t: number,
  offset = 0,
): VGeo {
  const dir = foldDir(left, right);
  const sh = Math.min(left, right);
  const lo = Math.max(left, right);
  const s = computeScale(Math.max(left, right, 1));
  const c: Point = { x: PIVOT_X, y: PIVOT_Y };
  const loAng = dir === "left" ? RIGHT_ANG : LEFT_ANG;
  const fp = pt(c, loAng, offset * sh * s);

  if (dir === "left") {
    const a = LEFT_ANG - 90 * t; // 135 → 45
    return {
      pivot: fp,
      left: buildArm(fp, pt(fp, a, sh * s), sh),
      right: buildArm(c, pt(c, RIGHT_ANG, lo * s), lo),
    };
  }
  const a = RIGHT_ANG + 90 * t; // 45 → 135
  return {
    pivot: fp,
    left: buildArm(c, pt(c, LEFT_ANG, lo * s), lo),
    right: buildArm(fp, pt(fp, a, sh * s), sh),
  };
}

// ── Phase 2 — swing-out + re-centre ────────────────────────────────────────

/**
 * @param totalFolds Total Phase-1 folds done (1 for subtraction, k for modulo).
 */
export function phase2(
  left: number,
  right: number,
  u: number,
  totalFolds = 1,
): VGeo {
  const dir = foldDir(left, right);
  const sh = Math.min(left, right);
  const lo = Math.max(left, right);
  const rem = lo - totalFolds * sh;
  const sOld = computeScale(Math.max(left, right, 1));
  const sNew = computeScale(Math.max(sh, Math.abs(rem), 1));
  const sc = lerp(sOld, sNew, u);
  const c: Point = { x: PIVOT_X, y: PIVOT_Y };

  if (dir === "left") {
    const fp = pt(c, RIGHT_ANG, totalFolds * sh * sOld);
    const piv = lp(fp, c, u);
    const backEnd = pt(piv, 225 - 90 * u, sh * sc);
    const exEnd = pt(piv, RIGHT_ANG, Math.abs(rem) * sc);
    return {
      pivot: piv,
      left: buildArm(piv, backEnd, sh),
      right: buildArm(piv, exEnd, Math.abs(rem)),
      bgLine:
        totalFolds > 1
          ? { start: c, end: pt(c, RIGHT_ANG, lo * sOld), opacity: 1 - u }
          : undefined,
    };
  }

  const fp = pt(c, LEFT_ANG, totalFolds * sh * sOld);
  const piv = lp(fp, c, u);
  const backEnd = pt(piv, 315 + 90 * u, sh * sc);
  const exEnd = pt(piv, LEFT_ANG, Math.abs(rem) * sc);
  return {
    pivot: piv,
    left: buildArm(piv, exEnd, Math.abs(rem)),
    right: buildArm(piv, backEnd, sh),
    bgLine:
      totalFolds > 1
        ? { start: c, end: pt(c, LEFT_ANG, lo * sOld), opacity: 1 - u }
        : undefined,
  };
}

// ── Morph — smooth transition when remainder = 0 ───────────────────────────

/**
 * Used when `longer % shorter === 0` (GCD found). Interpolates linearly from
 * the collapsed end-of-Phase-1 geometry to the target symmetric V.
 */
export function morphToV(
  from: VGeo,
  tgtLeft: number,
  tgtRight: number,
  u: number,
): VGeo {
  const tgt = staticV(tgtLeft, tgtRight);
  const piv = lp(from.pivot, tgt.pivot, u);
  const lEnd = lp(from.left.end, tgt.left.end, u);
  const rEnd = lp(from.right.end, tgt.right.end, u);
  return {
    pivot: piv,
    left: buildArm(piv, lEnd, tgtLeft),
    right: buildArm(piv, rEnd, tgtRight),
  };
}
