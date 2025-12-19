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

