import type { Step, CalculationResult } from "@/types";

/**
 * Computes the modular multiplicative inverse using the Extended Euclidean Algorithm.
 * 
 * Finds x such that ax ≡ 1 (mod m), if it exists.
 * The inverse exists if and only if gcd(a, m) = 1.
 * 
 * Uses the tabular method to compute Bézout coefficients s and t where:
 * as + mt = gcd(a, m)
 * 
 * @param a - The number to find the inverse of
 * @param m - The modulus
 * @returns CalculationResult with all steps and the inverse (if it exists)
 */
export function extendedEuclidean(a: number, m: number): CalculationResult {
  const originalA = a;
  const originalM = m;
  
  // Normalize a to be within [0, m-1]
  a = ((a % m) + m) % m;
  
  const steps: Step[] = [];
  
  // Initialize the algorithm
  // We track: (current_a, current_b) and their Bézout coefficients
  // s_i * originalA + t_i * originalM = current value at position
  
  let old_r = a;
  let r = m;
  let old_s = 1;
  let s = 0;
  let old_t = 0;
  let t = 1;
  
  let stepNum = 0;
  
  // First row (step 0): initial values
  steps.push({
    step: stepNum++,
    a: old_r,
    b: r,
    q: 0, // No quotient for first row
    r: old_r, // The "remainder" is the value itself
    s: old_s,
    t: old_t,
  });
  
  // Run the Extended Euclidean Algorithm
  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    const remainder = old_r - quotient * r;
    
    // Update Bézout coefficients
    const new_s = old_s - quotient * s;
    const new_t = old_t - quotient * t;
    
    steps.push({
      step: stepNum++,
      a: old_r,
      b: r,
      q: quotient,
      r: remainder,
      s: new_s,
      t: new_t,
    });
    
    // Shift values for next iteration
    old_r = r;
    r = remainder;
    old_s = s;
    s = new_s;
    old_t = t;
    t = new_t;
  }
  
  // old_r now contains gcd(a, m)
  // old_s is the coefficient such that old_s * a + old_t * m = gcd
  const gcd = old_r;
  
  // Check if inverse exists
  if (gcd !== 1) {
    return {
      inverse: null,
      gcd,
      steps,
      bezoutIdentity: { s: old_s, t: old_t },
      normalized: null,
      originalA,
      originalM,
    };
  }
  
  // Normalize the inverse to be in [0, m-1]
  const inverse = old_s;
  const normalized = ((inverse % originalM) + originalM) % originalM;
  
  return {
    inverse,
    gcd,
    steps,
    bezoutIdentity: { s: old_s, t: old_t },
    normalized,
    originalA,
    originalM,
  };
}

