"use client";

import type { Step, CalculationResult } from "@/types";

interface StepExplanationProps {
  result: CalculationResult;
}

export function StepExplanation({ result }: StepExplanationProps) {
  const { steps, originalA, originalM, normalized, bezoutIdentity, gcd } = result;
  
  if (steps.length <= 1) {
    return null;
  }

  // Get the algorithm steps (skip initialization row)
  const algorithmSteps = steps.slice(1);
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Step-by-Step Explanation</div>
      
      <div className="space-y-3 text-sm">
        {/* Introduction */}
        <div className="p-3 rounded-md bg-muted/30 border border-border/50">
          <div className="font-medium mb-1">Goal</div>
          <div className="text-muted-foreground">
            Find <span className="font-mono text-foreground">x</span> such that{" "}
            <span className="font-mono text-foreground">{originalA}x ≡ 1 (mod {originalM})</span>
          </div>
        </div>

        {/* Algorithm steps */}
        <div className="space-y-2">
          <div className="font-medium">Extended Euclidean Algorithm</div>
          {algorithmSteps.map((step, index) => (
            <div 
              key={step.step} 
              className="pl-4 border-l-2 border-muted py-1 text-muted-foreground"
            >
              <span className="font-medium text-foreground">Step {step.step}:</span>{" "}
              <span className="font-mono">
                {step.a} = {step.q} × {step.b} + {step.r}
              </span>
              {step.r === 0 && (
                <span className="ml-2 text-primary font-medium">
                  (remainder is 0, algorithm terminates)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* GCD result */}
        <div className="p-3 rounded-md bg-muted/30 border border-border/50">
          <div className="font-medium mb-1">GCD Result</div>
          <div className="text-muted-foreground">
            <span className="font-mono text-foreground">gcd({originalA}, {originalM}) = {gcd}</span>
            {gcd === 1 ? (
              <span className="ml-2 text-green-600">(inverse exists)</span>
            ) : (
              <span className="ml-2 text-destructive">(inverse does not exist)</span>
            )}
          </div>
        </div>

        {/* Bézout identity */}
        <div className="p-3 rounded-md bg-muted/30 border border-border/50">
          <div className="font-medium mb-1">Bézout Identity</div>
          <div className="text-muted-foreground font-mono">
            {originalA} × ({bezoutIdentity.s}) + {originalM} × ({bezoutIdentity.t}) = {gcd}
          </div>
        </div>

        {/* Normalization (if inverse exists) */}
        {normalized !== null && (
          <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
            <div className="font-medium mb-1">Normalization</div>
            <div className="text-muted-foreground space-y-1">
              <div>
                The coefficient <span className="font-mono text-foreground">s = {bezoutIdentity.s}</span> gives us{" "}
                <span className="font-mono text-foreground">{originalA} × {bezoutIdentity.s} ≡ 1 (mod {originalM})</span>
              </div>
              {bezoutIdentity.s !== normalized && (
                <div>
                  Normalizing to [0, {originalM - 1}]:{" "}
                  <span className="font-mono text-foreground">
                    {bezoutIdentity.s} mod {originalM} = {normalized}
                  </span>
                </div>
              )}
              <div className="font-medium text-primary mt-2">
                <span className="font-mono">x = {normalized}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

