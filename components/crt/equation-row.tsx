"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EquationRowProps {
  index: number;
  b: string;
  a: string;
  m: string;
  onBChange: (value: string) => void;
  onAChange: (value: string) => void;
  onMChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function EquationRow({
  index,
  b,
  a,
  m,
  onBChange,
  onAChange,
  onMChange,
  onRemove,
  canRemove,
}: EquationRowProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Row number */}
      <span className="text-xs text-muted-foreground w-4 shrink-0">
        {index + 1}.
      </span>

      {/* b coefficient (optional) */}
      <Input
        type="text"
        inputMode="numeric"
        placeholder="1"
        value={b}
        onChange={(e) => onBChange(e.target.value)}
        className="font-mono text-base h-9 w-16 text-center"
        aria-label={`Coefficient b for equation ${index + 1}`}
      />

      <span className="text-muted-foreground text-sm shrink-0">x ≡</span>

      {/* a remainder */}
      <Input
        type="text"
        inputMode="numeric"
        placeholder="a"
        value={a}
        onChange={(e) => onAChange(e.target.value)}
        className="font-mono text-base h-9 w-20 text-center"
        aria-label={`Remainder a for equation ${index + 1}`}
      />

      <span className="text-muted-foreground text-sm shrink-0">(mod</span>

      {/* m modulus */}
      <Input
        type="text"
        inputMode="numeric"
        placeholder="m"
        value={m}
        onChange={(e) => onMChange(e.target.value)}
        className="font-mono text-base h-9 w-20 text-center"
        aria-label={`Modulus m for equation ${index + 1}`}
      />

      <span className="text-muted-foreground text-sm shrink-0">)</span>

      {/* Remove button */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={!canRemove}
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`Remove equation ${index + 1}`}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
