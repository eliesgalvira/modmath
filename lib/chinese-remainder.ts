import type {
  ParsedCRTEquation,
  TransformedEquation,
  CRTStep,
  CRTResult,
  CRTEquation,
} from "@/types";
import { extendedEuclidean } from "./extended-euclidean";

/**
 * Validates and parses CRT equations from string inputs
 */
export function parseCRTEquations(
  equations: CRTEquation[]
): { valid: true; equations: ParsedCRTEquation[] } | { valid: false; error: string } {
  if (equations.length < 2) {
    return { valid: false, error: "At least 2 equations are required for CRT" };
  }

  const parsed: ParsedCRTEquation[] = [];

  for (let i = 0; i < equations.length; i++) {
    const eq = equations[i];
    const rowNum = i + 1;

    // Parse b (coefficient) - default to 1 if empty
    const bStr = eq.b.trim();
    const b = bStr === "" ? 1 : parseInt(bStr, 10);
    if (isNaN(b)) {
      return { valid: false, error: `Row ${rowNum}: coefficient 'b' must be a valid integer` };
    }
    if (b === 0) {
      return { valid: false, error: `Row ${rowNum}: coefficient 'b' cannot be zero` };
    }

    // Parse a (remainder)
    const a = parseInt(eq.a.trim(), 10);
    if (isNaN(a)) {
      return { valid: false, error: `Row ${rowNum}: remainder 'a' must be a valid integer` };
    }

    // Parse m (modulus)
    const m = parseInt(eq.m.trim(), 10);
    if (isNaN(m)) {
      return { valid: false, error: `Row ${rowNum}: modulus 'm' must be a valid integer` };
    }
    if (m <= 1) {
      return { valid: false, error: `Row ${rowNum}: modulus 'm' must be greater than 1` };
    }

    parsed.push({ b, a, m });
  }

  // Check that all moduli are pairwise coprime
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      const gcdResult = gcd(parsed[i].m, parsed[j].m);
      if (gcdResult !== 1) {
        return {
          valid: false,
          error: `Moduli must be pairwise coprime. gcd(${parsed[i].m}, ${parsed[j].m}) = ${gcdResult} ≠ 1`,
        };
      }
    }
  }

  return { valid: true, equations: parsed };
}

/**
 * Simple GCD function using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Transforms equation from bx ≡ a (mod m) to x ≡ a' (mod m)
 * by computing a' = a × b^(-1) mod m
 */
function transformEquation(eq: ParsedCRTEquation): TransformedEquation {
  const { b, a, m } = eq;

  // Calculate b^(-1) mod m using Extended Euclidean Algorithm
  const bInverse = extendedEuclidean(b, m);

  if (bInverse.gcd !== 1) {
    // This shouldn't happen if validation passed, but handle it
    throw new Error(`Cannot find inverse of ${b} mod ${m}: gcd = ${bInverse.gcd}`);
  }

  // Calculate transformed remainder: a' = a × b^(-1) mod m
  const transformedA = ((a * bInverse.normalized!) % m + m) % m;

  return {
    original: eq,
    bInverse,
    transformed: { a: transformedA, m },
  };
}

/**
 * Solves the Chinese Remainder Theorem for a system of congruences.
 * 
 * Given equations of the form bᵢx ≡ aᵢ (mod mᵢ), finds x such that
 * x ≡ solution (mod M) where M = m₁ × m₂ × ... × mₖ
 */
export function solveCRT(equations: ParsedCRTEquation[]): CRTResult {
  // Step 1: Transform equations to the form x ≡ a (mod m)
  const transformedEquations: TransformedEquation[] = [];

  for (const eq of equations) {
    if (eq.b === 1) {
      // No transformation needed, but we still record it
      transformedEquations.push({
        original: eq,
        bInverse: extendedEuclidean(1, eq.m), // Trivial inverse of 1
        transformed: { a: ((eq.a % eq.m) + eq.m) % eq.m, m: eq.m },
      });
    } else {
      transformedEquations.push(transformEquation(eq));
    }
  }

  // Get the simplified equations
  const simplifiedEquations = transformedEquations.map((te) => te.transformed);

  // Step 2: Calculate M = product of all moduli
  const M = simplifiedEquations.reduce(
    (acc, eq) => acc * BigInt(eq.m),
    BigInt(1)
  );

  // Step 3: Calculate Mᵢ = M / mᵢ for each equation
  const Mi: bigint[] = simplifiedEquations.map((eq) => M / BigInt(eq.m));

  // Step 4: Calculate Mᵢ⁻¹ mod mᵢ for each equation
  const inverseCalculations: import("@/types").CalculationResult[] = [];
  const MiInverses: number[] = [];

  for (let i = 0; i < simplifiedEquations.length; i++) {
    const mi = simplifiedEquations[i].m;
    // We need Mi mod mi first
    const MiModMi = Number(Mi[i] % BigInt(mi));
    const inverseResult = extendedEuclidean(MiModMi, mi);
    inverseCalculations.push(inverseResult);
    MiInverses.push(inverseResult.normalized!);
  }

  // Step 5: Calculate terms aᵢ × Mᵢ × Mᵢ⁻¹
  const terms: bigint[] = [];
  for (let i = 0; i < simplifiedEquations.length; i++) {
    const ai = BigInt(simplifiedEquations[i].a);
    const term = ai * Mi[i] * BigInt(MiInverses[i]);
    terms.push(term);
  }

  // Step 6: Calculate x = sum of terms mod M
  const sum = terms.reduce((acc, term) => acc + term, BigInt(0));
  const solution = ((sum % M) + M) % M;

  const steps: CRTStep = {
    M,
    equations: simplifiedEquations,
    Mi,
    MiInverses,
    inverseCalculations,
    terms,
  };

  return {
    solution,
    modulus: M,
    transformedEquations,
    steps,
    originalEquations: equations,
  };
}

/**
 * Verifies a CRT solution by checking all original equations
 */
export function verifyCRTSolution(
  solution: bigint,
  equations: ParsedCRTEquation[]
): { equation: ParsedCRTEquation; result: bigint; expected: number; valid: boolean }[] {
  return equations.map((eq) => {
    // Check: b × solution mod m should equal a mod m
    const result = (BigInt(eq.b) * solution) % BigInt(eq.m);
    const expected = ((eq.a % eq.m) + eq.m) % eq.m;
    return {
      equation: eq,
      result,
      expected,
      valid: result === BigInt(expected),
    };
  });
}
