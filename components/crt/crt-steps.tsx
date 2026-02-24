"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StepsTable } from "@/components/steps-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { CRTResult, CalculationResult } from "@/types";

interface CRTStepsProps {
  result: CRTResult;
}

interface CollapsibleInverseProps {
  title: string;
  calculation: CalculationResult;
  defaultOpen?: boolean;
}

function CollapsibleInverse({ title, calculation, defaultOpen = false }: CollapsibleInverseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="size-4 shrink-0" />
        ) : (
          <ChevronRight className="size-4 shrink-0" />
        )}
        <span className="font-mono">{title}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-border/30">
          <StepsTable steps={calculation.steps} />
          <div className="mt-2 text-xs text-muted-foreground">
            So the multiplicative inverse is{" "}
            <span className="font-mono text-foreground">
              {calculation.bezoutIdentity.s} mod {calculation.originalM} ≡ {calculation.normalized}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function CRTSteps({ result }: CRTStepsProps) {
  const { transformedEquations, steps, modulus, solution } = result;
  const hasCoefficients = transformedEquations.some((te) => te.original.b !== 1);

  return (
    <Card className="shadow-md border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Step-by-Step Calculation</CardTitle>
        <CardDescription>
          Chinese Remainder Theorem algorithm walkthrough
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Transform equations (if needed) */}
        {hasCoefficients && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium">
              Step 1: Transform equations to x ≡ a (mod m) form
            </h3>
            <p className="text-xs text-muted-foreground">
              When equations have coefficients (bx ≡ a mod m), we need to multiply both
              sides by b⁻¹ to get x ≡ a × b⁻¹ (mod m).
            </p>

            <div className="space-y-3">
              {transformedEquations
                .filter((te) => te.original.b !== 1)
                .map((te, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-sm">
                      <span className="font-mono">
                        {te.original.b}x ≡ {te.original.a} (mod {te.original.m})
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-mono">
                        x ≡ {te.original.a} × {te.original.b}⁻¹ (mod {te.original.m})
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-mono text-primary font-medium">
                        x ≡ {te.transformed.a} (mod {te.transformed.m})
                      </span>
                    </div>
                    <CollapsibleInverse
                      title={`${te.original.b}⁻¹ (mod ${te.original.m}) = ${te.bInverse.normalized}`}
                      calculation={te.bInverse}
                    />
                  </div>
                ))}
            </div>

            <div className="bg-muted/30 rounded-md p-3">
              <div className="text-sm font-medium mb-2">Simplified equations:</div>
              <div className="space-y-1">
                {transformedEquations.map((te, index) => (
                  <div key={index} className="font-mono text-sm">
                    x ≡ {te.transformed.a} (mod {te.transformed.m})
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </section>
        )}

        {/* Step 2: Calculate M */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium">
            {hasCoefficients ? "Step 2" : "Step 1"}: Calculate common modulus M
          </h3>
          <div className="bg-muted/30 rounded-md p-3">
            <div className="font-mono text-sm">
              M = {steps.equations.map((eq) => eq.m).join(" × ")} = {steps.M.toString()}
            </div>
          </div>
        </section>

        {/* Step 3: Calculate Mi values */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium">
            {hasCoefficients ? "Step 3" : "Step 2"}: Calculate Mᵢ = M / mᵢ
          </h3>
          <div className="bg-muted/30 rounded-md p-3 space-y-1">
            {steps.equations.map((eq, index) => (
              <div key={index} className="font-mono text-sm">
                M<sub>{index + 1}</sub> = {steps.M.toString()} / {eq.m} = {steps.Mi[index].toString()}
              </div>
            ))}
          </div>
        </section>

        {/* Step 4: Calculate Mi inverses */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium">
            {hasCoefficients ? "Step 4" : "Step 3"}: Calculate Mᵢ⁻¹ (mod mᵢ)
          </h3>
          <p className="text-xs text-muted-foreground">
            Find the modular inverse of each Mᵢ modulo mᵢ using the Extended Euclidean Algorithm.
          </p>
          <div className="space-y-2">
            {steps.equations.map((eq, index) => {
              const MiModMi = Number(steps.Mi[index] % BigInt(eq.m));
              return (
                <CollapsibleInverse
                  key={index}
                  title={`M${index + 1}⁻¹ = ${MiModMi}⁻¹ (mod ${eq.m}) = ${steps.MiInverses[index]}`}
                  calculation={steps.inverseCalculations[index]}
                />
              );
            })}
          </div>
        </section>

        {/* Step 5: Calculate solution */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium">
            {hasCoefficients ? "Step 5" : "Step 4"}: Calculate the solution
          </h3>
          <div className="bg-muted/30 rounded-md p-3 space-y-3">
            <div className="text-sm text-muted-foreground">
              x = (a₁ × M₁ × M₁⁻¹ + a₂ × M₂ × M₂⁻¹ + ...) mod M
            </div>
            <div className="space-y-1">
              {steps.equations.map((eq, index) => (
                <div key={index} className="font-mono text-sm">
                  a<sub>{index + 1}</sub> × M<sub>{index + 1}</sub> × M<sub>{index + 1}</sub>⁻¹ ={" "}
                  {eq.a} × {steps.Mi[index].toString()} × {steps.MiInverses[index]} ={" "}
                  {steps.terms[index].toString()}
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="font-mono text-sm">
              Sum = {steps.terms.map((t) => t.toString()).join(" + ")} ={" "}
              {steps.terms.reduce((a, b) => a + b, BigInt(0)).toString()}
            </div>
            <div className="font-mono text-sm font-medium text-primary">
              x = {steps.terms.reduce((a, b) => a + b, BigInt(0)).toString()} mod{" "}
              {modulus.toString()} = {solution.toString()}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
