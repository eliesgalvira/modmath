"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CRTForm, CRTResultCard, CRTSteps } from "@/components/crt";
import { ErrorAlert } from "@/components/error-alert";
import { useCRTCalculator } from "@/hooks/use-crt-calculator";

export default function CRTPage() {
  const { result, error, verification, hasCalculated, calculate } = useCRTCalculator();

  const showError = error && !result;
  const showResult = result && verification;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Calculator Card */}
        <Card className="shadow-lg border-border/60">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl sm:text-2xl tracking-tight">
              Chinese Remainder Theorem Calculator
            </CardTitle>
            <CardDescription className="text-sm">
              Solve systems of linear congruences with step-by-step explanations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <CRTForm onCalculate={calculate} />
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasCalculated && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Error Alert */}
            {showError && <ErrorAlert message={error} />}

            {/* Result Card */}
            {showResult && (
              <>
                <CRTResultCard result={result} verification={verification} />
                <CRTSteps result={result} />
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4">
          <p>
            The Chinese Remainder Theorem states that if{" "}
            <span className="font-mono">m₁, m₂, ..., mₖ</span> are pairwise coprime,
            then the system of congruences has a unique solution modulo{" "}
            <span className="font-mono">M = m₁ × m₂ × ... × mₖ</span>.
          </p>
        </footer>
      </div>
    </main>
  );
}
