"use client";

import { useState, useCallback } from "react";
import type { Step, CalculationResult } from "@/types";
import { extendedEuclidean } from "@/lib/extended-euclidean";
import { validateInputs } from "@/lib/validators";

interface UseInverseCalculatorReturn {
  a: string;
  m: string;
  setA: (val: string) => void;
  setM: (val: string) => void;
  result: CalculationResult | null;
  steps: Step[];
  error: string | null;
  calculate: () => void;
  hasCalculated: boolean;
}

export function useInverseCalculator(): UseInverseCalculatorReturn {
  const [a, setA] = useState("");
  const [m, setM] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculate = useCallback(() => {
    // Clear previous results
    setResult(null);
    setError(null);
    setHasCalculated(true);

    // Validate inputs
    const validation = validateInputs(a, m);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid input");
      return;
    }

    const { a: numA, m: numM } = validation.values!;

    // Run the Extended Euclidean Algorithm
    const calcResult = extendedEuclidean(numA, numM);

    // Check if inverse exists
    if (calcResult.gcd !== 1) {
      setError(
        `No modular inverse exists because gcd(${numA}, ${numM}) = ${calcResult.gcd} ≠ 1. ` +
        `The modular inverse only exists when gcd(a, m) = 1.`
      );
      setResult(calcResult); // Still set result so we can show the steps
      return;
    }

    setResult(calcResult);
  }, [a, m]);

  return {
    a,
    m,
    setA,
    setM,
    result,
    steps: result?.steps ?? [],
    error,
    calculate,
    hasCalculated,
  };
}

