/**
 * Represents a single step in the Extended Euclidean Algorithm table
 */
export interface Step {
  step: number;
  a: number;
  b: number;
  q: number;      // quotient: floor(a / b)
  r: number;      // remainder: a mod b
  s: number;      // Bézout coefficient for original a
  t: number;      // Bézout coefficient for original m
}

/**
 * Result of the modular inverse calculation
 */
export interface CalculationResult {
  /** The modular inverse if it exists, null otherwise */
  inverse: number | null;
  /** The GCD of a and m */
  gcd: number;
  /** All steps of the Extended Euclidean Algorithm */
  steps: Step[];
  /** The Bézout coefficients where as + mt = gcd(a, m) */
  bezoutIdentity: { s: number; t: number };
  /** The inverse normalized to [0, m-1], null if no inverse exists */
  normalized: number | null;
  /** Original input values */
  originalA: number;
  originalM: number;
}

/**
 * Validation result for input values
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  value?: number;
}

// ============================================
// Chinese Remainder Theorem Types
// ============================================

/**
 * A single CRT equation in the form: bx ≡ a (mod m)
 * When b is empty or "1", it represents x ≡ a (mod m)
 */
export interface CRTEquation {
  id: string;     // Unique identifier for React keys
  b: string;      // Coefficient (optional, empty or "1" means coefficient is 1)
  a: string;      // Remainder
  m: string;      // Modulus
}

/**
 * Parsed and validated equation with numeric values
 */
export interface ParsedCRTEquation {
  b: number;
  a: number;
  m: number;
}

/**
 * Represents a transformed equation from bx ≡ a (mod m) to x ≡ a' (mod m)
 */
export interface TransformedEquation {
  original: ParsedCRTEquation;
  bInverse: CalculationResult;  // The inverse calculation for b
  transformed: { a: number; m: number };
}

/**
 * The main CRT calculation steps
 */
export interface CRTStep {
  M: bigint;                           // Product of all moduli
  equations: { a: number; m: number }[]; // The simplified equations
  Mi: bigint[];                        // M / mi for each equation
  MiInverses: number[];                // Modular inverse of Mi mod mi
  inverseCalculations: CalculationResult[]; // Extended Euclidean steps for each Mi inverse
  terms: bigint[];                     // ai × Mi × Mi^-1 for each equation
}

/**
 * Complete result of a CRT calculation
 */
export interface CRTResult {
  solution: bigint;
  modulus: bigint;
  transformedEquations: TransformedEquation[];
  steps: CRTStep;
  originalEquations: ParsedCRTEquation[];
}

