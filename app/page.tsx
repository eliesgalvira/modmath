"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalculatorForm } from "@/components/calculator-form";
import { ResultCard } from "@/components/result-card";
import { StepsTable } from "@/components/steps-table";
import { StepExplanation } from "@/components/step-explanation";
import { ErrorAlert } from "@/components/error-alert";
import { useInverseCalculator } from "@/hooks/use-inverse-calculator";

export default function Page() {
  const {
    result,
    error,
    calculate,
    hasCalculated,
  } = useInverseCalculator();

  const showError = error && (!result || result.gcd !== 1);
  const showResult = result && result.normalized !== null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Calculator Card */}
        <Card className="shadow-lg border-border/60">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl sm:text-2xl tracking-tight">
              Modular Inverse Calculator
            </CardTitle>
            <CardDescription className="text-sm">
              Calculate the modular multiplicative inverse using the Extended Euclidean Algorithm
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <CalculatorForm onCalculate={calculate} />
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasCalculated && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Error Alert */}
            {showError && <ErrorAlert message={error} />}

            {/* Result Card */}
            {showResult && <ResultCard result={result} />}

            {/* Steps Table */}
            {result && result.steps.length > 0 && (
              <Card className="shadow-md border-border/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Algorithm Steps</CardTitle>
                  <CardDescription>
                    Bézout identity table showing each iteration of the Extended Euclidean Algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <StepsTable steps={result.steps} />
                  
                  <Separator />
                  
                  <StepExplanation result={result} />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4">
          <p>
            The modular multiplicative inverse of <span className="font-mono">a</span> modulo{" "}
            <span className="font-mono">m</span> is an integer <span className="font-mono">x</span> such that{" "}
            <span className="font-mono">ax ≡ 1 (mod m)</span>.
          </p>
          <p className="mt-1">
            It exists if and only if <span className="font-mono">gcd(a, m) = 1</span>.
          </p>
        </footer>
      </div>
    </main>
  );
}
