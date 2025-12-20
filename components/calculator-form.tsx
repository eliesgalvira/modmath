"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorFormProps {
  onCalculate: (a: string, m: string) => void;
}

export function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [a, setA] = useState("");
  const [m, setM] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(a, m);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate(a, m);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-muted-foreground text-sm mb-4">
        Find <span className="font-mono text-foreground">x</span> such that{" "}
        <span className="font-mono text-foreground">ax ≡ 1 (mod m)</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="input-a" className="text-sm font-medium">
            Number (a)
          </Label>
          <Input
            id="input-a"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 7"
            value={a}
            onChange={(e) => setA(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-mono text-base h-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="input-m" className="text-sm font-medium">
            Modulus (m)
          </Label>
          <Input
            id="input-m"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 26"
            value={m}
            onChange={(e) => setM(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-mono text-base h-10"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full h-10 text-sm font-medium">
        Calculate Inverse
      </Button>
    </form>
  );
}

