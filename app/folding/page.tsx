"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

import { useFolding } from "@/hooks/use-folding";
import {
  staticV,
  phase1,
  phase2,
  morphToV,
  type VGeo,
  VB_W,
  VB_H,
} from "@/lib/euclid-folding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ── Framer-Motion animation driver ────────────────────────────────────────

function useAnimationDriver(
  folding: ReturnType<typeof useFolding>,
  setGeo: (g: VGeo) => void,
) {
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.speed = folding.speed;
  }, [folding.speed]);

  useEffect(() => {
    if (!folding.playing || folding.isComplete) return;

    const step = folding.steps[folding.currentStep];
    const nextStep = folding.steps[folding.currentStep + 1];
    if (!step || !nextStep) return;

    let active = true;
    const allCtrl: AnimationPlaybackControls[] = [];

    const { left, right } = step;
    const { quickFolds } = nextStep;
    const shorter = Math.min(left, right);
    const longer = Math.max(left, right);
    const totalFoldsCount = quickFolds + 1;
    const remainder = longer - totalFoldsCount * shorter;

    const BASE = 0.8;
    const QUICK = 0.35;
    const MORPH = 0.6;

    function anim(dur: number, fn: (t: number) => void): Promise<void> {
      return new Promise<void>((resolve) => {
        if (!active) return resolve();
        const c = animate(0, 1, {
          duration: dur,
          ease: "easeInOut",
          onUpdate: (v) => {
            if (active) fn(v);
          },
          onComplete: resolve,
        });
        c.speed = folding.speed;
        allCtrl.push(c);
        controlsRef.current = c;
      });
    }

    (async () => {
      for (let i = 0; i < quickFolds && active; i++) {
        await anim(QUICK, (t) => setGeo(phase1(left, right, t, i)));
      }
      if (active)
        await anim(BASE, (t) => setGeo(phase1(left, right, t, quickFolds)));
      if (active) {
        if (remainder === 0 && nextStep.left === nextStep.right) {
          const from = phase1(left, right, 1, quickFolds);
          await anim(MORPH, (t) =>
            setGeo(morphToV(from, nextStep.left, nextStep.right, t)),
          );
        } else {
          await anim(BASE, (t) =>
            setGeo(phase2(left, right, t, totalFoldsCount)),
          );
        }
      }
      if (active) folding.advance();
    })();

    return () => {
      active = false;
      allCtrl.forEach((c) => c.stop());
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folding.playing, folding.currentStep]);
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function FoldingPage() {
  const folding = useFolding();
  const [geo, setGeo] = useState<VGeo>(() => staticV(folding.a, folding.b));

  useEffect(() => {
    const step = folding.steps[folding.currentStep];
    if (step && !folding.playing) setGeo(staticV(step.left, step.right));
  }, [folding.steps, folding.currentStep, folding.playing]);

  useEffect(() => {
    setGeo(staticV(folding.a, folding.b));
  }, [folding.a, folding.b]);

  useAnimationDriver(folding, setGeo);

  const handleA = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10);
      folding.setA(isNaN(v) ? 0 : Math.max(0, v));
    },
    [folding],
  );
  const handleB = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10);
      folding.setB(isNaN(v) ? 0 : Math.max(0, v));
    },
    [folding],
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── Controls Card ── */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl tracking-tight sm:text-2xl">
              Folding Segments
            </CardTitle>
            <CardDescription className="text-sm">
              Visualize the Euclidean algorithm by folding segments
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input-a" className="text-sm font-medium">
                  Number (a)
                </Label>
                <Input
                  id="input-a"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 34"
                  value={folding.a || ""}
                  onChange={handleA}
                  className="font-mono text-base h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-b" className="text-sm font-medium">
                  Number (b)
                </Label>
                <Input
                  id="input-b"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 55"
                  value={folding.b || ""}
                  onChange={handleB}
                  className="font-mono text-base h-10"
                />
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="min-w-[100px] gap-1.5"
                onClick={folding.playing ? folding.pause : folding.play}
                disabled={
                  !!folding.error || (folding.isComplete && !folding.playing)
                }
              >
                {folding.playing ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
                {folding.playing ? "Pause" : "Play"}
              </Button>

              <Button
                variant="outline"
                onClick={folding.reset}
                className="gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </Button>
            </div>

            {/* Speed + modulo row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground shrink-0 text-xs">
                  Speed
                </Label>
                <div className="w-44 sm:w-56">
                  <Slider
                    value={[folding.speed * 100]}
                    onValueChange={(v) =>
                      folding.setSpeed((Array.isArray(v) ? v[0] : v) / 100)
                    }
                    min={50}
                    max={400}
                    step={25}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs tabular-nums">
                  {folding.speed.toFixed(1)}×
                </span>
              </div>

              <label className="flex items-center gap-2">
                <Switch
                  checked={folding.useModulo}
                  onCheckedChange={(v) => folding.setUseModulo(Boolean(v))}
                />
                <span className="text-xs select-none">
                  Use Modulo (Faster)
                </span>
              </label>
            </div>

            {/* Error */}
            {folding.error && (
              <p className="text-destructive text-sm font-medium">
                {folding.error}
              </p>
            )}

            {/* Step counter + GCD */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground tabular-nums">
                Step {folding.currentStep} / {folding.totalSteps}
              </span>
              {folding.isComplete && folding.gcd > 0 && (
                <Badge className="text-sm">GCD = {folding.gcd}</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── SVG visualisation ── */}
        <Card className="border-border/60 shadow-md overflow-hidden">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full"
            style={{ background: "#0f172a" }}
          >
            {geo.bgLine && (
              <line
                x1={geo.bgLine.start.x}
                y1={geo.bgLine.start.y}
                x2={geo.bgLine.end.x}
                y2={geo.bgLine.end.y}
                stroke="#94a3b8"
                strokeWidth={2}
                opacity={geo.bgLine.opacity * 0.3}
              />
            )}

            {geo.left.value > 0 && (
              <>
                <line
                  x1={geo.left.start.x}
                  y1={geo.left.start.y}
                  x2={geo.left.end.x}
                  y2={geo.left.end.y}
                  stroke="#94a3b8"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {geo.left.beads.map((b, i) => (
                  <circle
                    key={`l${i}`}
                    cx={b.x}
                    cy={b.y}
                    r={3}
                    fill="#e2e8f0"
                    stroke="#64748b"
                    strokeWidth={1}
                  />
                ))}
                <text
                  x={geo.left.labelPos.x}
                  y={geo.left.labelPos.y}
                  fill="white"
                  fontSize={36}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {geo.left.value}
                </text>
              </>
            )}

            {geo.right.value > 0 && (
              <>
                <line
                  x1={geo.right.start.x}
                  y1={geo.right.start.y}
                  x2={geo.right.end.x}
                  y2={geo.right.end.y}
                  stroke="#94a3b8"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {geo.right.beads.map((b, i) => (
                  <circle
                    key={`r${i}`}
                    cx={b.x}
                    cy={b.y}
                    r={3}
                    fill="#e2e8f0"
                    stroke="#64748b"
                    strokeWidth={1}
                  />
                ))}
                <text
                  x={geo.right.labelPos.x}
                  y={geo.right.labelPos.y}
                  fill="white"
                  fontSize={36}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {geo.right.value}
                </text>
              </>
            )}

            <circle
              cx={geo.pivot.x}
              cy={geo.pivot.y}
              r={4}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth={1}
            />
          </svg>
        </Card>

        {/* ── Credit footer ── */}
        <footer className="text-muted-foreground pt-4 text-center text-xs">
          <p>
            Visualization inspired by{" "}
            <span className="font-mono text-foreground">
              Matt Henderson (@matthen2)
            </span>
          </p>
          <p className="mt-1">
            <a
              href="https://x.com/matthen2/status/2020510389302174189"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline underline-offset-2"
            >
              x.com/matthen2/status/2020510389302174189
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
