"use client";

import { useState } from "react";
import type { Step, CalculationResult } from "@/types";
import { extendedEuclidean } from "@/lib/extended-euclidean";
import { validateInputs } from "@/lib/validators";

interface UseInverseCalculatorReturn {
  result: CalculationResult | null;
  steps: Step[];
  error: string | null;
  calculate: (a: string, m: string) => void;
  hasCalculated: boolean;
}

export function useInverseCalculator(): UseInverseCalculatorReturn {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculate = (a: string, m: string) => {
    // Validate inputs first
    const validation = validateInputs(a, m);
    if (!validation.valid) {
      // Idempotent: skip if same validation error
      if (error === validation.error) {
        return;
      }
      setResult(null);
      setError(validation.error ?? "Invalid input");
      setHasCalculated(true);
      return;
    }

    const { a: numA, m: numM } = validation.values!;

    // Idempotent: skip if result already matches these inputs
    if (result?.originalA === numA && result?.originalM === numM) {
      return;
    }

    setHasCalculated(true);

    // Run the Extended Euclidean Algorithm
    const calcResult = extendedEuclidean(numA, numM);

    // Check if inverse exists
    if (calcResult.gcd !== 1) {
      setError(
        `No modular inverse exists because gcd(${numA}, ${numM}) = ${calcResult.gcd} ≠ 1. ` +
        `The modular inverse only exists when gcd(a, m) = 1.`
      );
      setResult(calcResult);
      return;
    }

    setError(null);
    setResult(calcResult);
  };

  return {
    result,
    steps: result?.steps ?? [],
    error,
    calculate,
    hasCalculated,
  };
}

