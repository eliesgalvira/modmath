"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CRTResult, ParsedCRTEquation } from "@/types";
import { Check } from "lucide-react";

interface CRTResultCardProps {
  result: CRTResult;
  verification: {
    equation: ParsedCRTEquation;
    result: bigint;
    expected: number;
    valid: boolean;
  }[];
}

export function CRTResultCard({ result, verification }: CRTResultCardProps) {
  const allValid = verification.every((v) => v.valid);

  return (
    <Card className="shadow-md border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Solution</CardTitle>
          {allValid && (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600/30">
              <Check className="size-3" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main result */}
        <div className="bg-muted/50 rounded-md p-4 text-center">
          <div className="text-sm text-muted-foreground mb-1">
            The solution is:
          </div>
          <div className="font-mono text-xl font-semibold">
            x ≡ {result.solution.toString()} (mod {result.modulus.toString()})
          </div>
        </div>

        {/* Verification */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Verification</div>
          <div className="text-xs text-muted-foreground mb-2">
            Checking that x = {result.solution.toString()} satisfies all original equations:
          </div>
          <div className="space-y-1.5">
            {verification.map((v, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm font-mono bg-muted/30 rounded px-3 py-1.5"
              >
                <Check className="size-3.5 text-green-600 shrink-0" />
                <span>
                  {v.equation.b !== 1 && `${v.equation.b} × `}
                  {result.solution.toString()} mod {v.equation.m} ={" "}
                  {v.result.toString()} ≡ {v.expected} (mod {v.equation.m})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
