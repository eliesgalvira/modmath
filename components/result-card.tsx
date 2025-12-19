"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalculationResult } from "@/types";

interface ResultCardProps {
  result: CalculationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  if (result.normalized === null) {
    return null;
  }

  const { originalA, originalM, normalized, bezoutIdentity } = result;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(normalized.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Verification calculation
  const verification = (originalA * normalized) % originalM;

  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            Modular Inverse
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            x = {normalized}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleCopy}
          className="shrink-0"
          aria-label="Copy result"
        >
          {copied ? (
            <Check className="size-4 text-green-600" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>

      <div className="text-sm space-y-1 pt-2 border-t border-primary/10">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Result:</span>
          <code className="font-mono text-foreground">
            {originalA} × {normalized} ≡ 1 (mod {originalM})
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Verification:</span>
          <code className="font-mono text-foreground">
            {originalA} × {normalized} mod {originalM} = {verification}
          </code>
          {verification === 1 && (
            <Check className="size-4 text-green-600" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Bézout identity:</span>
          <code className="font-mono text-foreground">
            {originalA}({bezoutIdentity.s}) + {originalM}({bezoutIdentity.t}) = 1
          </code>
        </div>
      </div>
    </div>
  );
}

