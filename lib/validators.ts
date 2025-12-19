import type { ValidationResult } from "@/types";

/**
 * Validates that a string represents a positive integer
 */
export function validatePositiveInteger(val: string, fieldName: string): ValidationResult {
  const trimmed = val.trim();
  
  if (trimmed === "") {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  // Check if it's a valid integer (no decimals, no scientific notation for user input)
  if (!/^-?\d+$/.test(trimmed)) {
    return { valid: false, error: `${fieldName} must be a valid integer` };
  }
  
  const num = parseInt(trimmed, 10);
  
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (num <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }
  
  // Check for reasonable size to prevent performance issues
  if (num > Number.MAX_SAFE_INTEGER) {
    return { valid: false, error: `${fieldName} is too large` };
  }
  
  return { valid: true, value: num };
}

/**
 * Validates both inputs together
 */
export function validateInputs(a: string, m: string): { 
  valid: boolean; 
  error?: string; 
  values?: { a: number; m: number } 
} {
  const aResult = validatePositiveInteger(a, "Number (a)");
  if (!aResult.valid) {
    return { valid: false, error: aResult.error };
  }
  
  const mResult = validatePositiveInteger(m, "Modulus (m)");
  if (!mResult.valid) {
    return { valid: false, error: mResult.error };
  }
  
  // Additional validation: m must be greater than 1 for modular arithmetic to make sense
  if (mResult.value! <= 1) {
    return { valid: false, error: "Modulus (m) must be greater than 1" };
  }
  
  return { 
    valid: true, 
    values: { a: aResult.value!, m: mResult.value! } 
  };
}

