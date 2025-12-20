"use client";

import { useState, useRef, useCallback } from "react";
import type { CRTEquation, CRTResult } from "@/types";
import { parseCRTEquations, solveCRT, verifyCRTSolution } from "@/lib/chinese-remainder";

interface UseCRTCalculatorReturn {
  result: CRTResult | null;
  error: string | null;
  hasCalculated: boolean;
  verification: ReturnType<typeof verifyCRTSolution> | null;
  calculate: (equations: CRTEquation[]) => void;
}

/**
 * Serialize equations for comparison to detect duplicate calculations
 */
function serializeEquations(equations: CRTEquation[]): string {
  return equations
    .map((eq) => `${eq.b.trim() || "1"}:${eq.a.trim()}:${eq.m.trim()}`)
    .join("|");
}

export function useCRTCalculator(): UseCRTCalculatorReturn {
  const [result, setResult] = useState<CRTResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [verification, setVerification] = useState<ReturnType<typeof verifyCRTSolution> | null>(null);

  // Track last calculated state for idempotency
  const lastCalculationRef = useRef<{
    serialized: string;
    error: string | null;
    success: boolean;
  } | null>(null);

  const calculate = useCallback((equations: CRTEquation[]) => {
    const serialized = serializeEquations(equations);

    // Idempotency check: skip if same equations were just calculated
    if (lastCalculationRef.current?.serialized === serialized) {
      return;
    }

    // Validate and parse equations
    const parseResult = parseCRTEquations(equations);

    if (!parseResult.valid) {
      // Idempotency: skip if same error already displayed
      if (error === parseResult.error) {
        return;
      }

      lastCalculationRef.current = {
        serialized,
        error: parseResult.error,
        success: false,
      };

      setResult(null);
      setVerification(null);
      setError(parseResult.error);
      setHasCalculated(true);
      return;
    }

    // Solve CRT
    try {
      const crtResult = solveCRT(parseResult.equations);
      const verificationResult = verifyCRTSolution(
        crtResult.solution,
        parseResult.equations
      );

      lastCalculationRef.current = {
        serialized,
        error: null,
        success: true,
      };

      setError(null);
      setResult(crtResult);
      setVerification(verificationResult);
      setHasCalculated(true);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";
      
      lastCalculationRef.current = {
        serialized,
        error: errorMessage,
        success: false,
      };

      setResult(null);
      setVerification(null);
      setError(errorMessage);
      setHasCalculated(true);
    }
  }, [error]);

  return {
    result,
    error,
    hasCalculated,
    verification,
    calculate,
  };
}
