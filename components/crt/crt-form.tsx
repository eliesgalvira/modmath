"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { EquationRow } from "./equation-row";
import type { CRTEquation } from "@/types";
import { Plus, Shuffle, Trash2 } from "lucide-react";

interface CRTFormProps {
  onCalculate: (equations: CRTEquation[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyEquation(): CRTEquation {
  return { id: generateId(), b: "", a: "", m: "" };
}

/**
 * Generate random coprime numbers for demonstration
 */
function generateRandomEquations(): CRTEquation[] {
  // Use small coprime moduli that are guaranteed to work
  const coprimeModuli = [3, 5, 7, 11, 13, 17, 19, 23];
  
  // Pick 3 random coprime moduli
  const shuffled = [...coprimeModuli].sort(() => Math.random() - 0.5);
  const selectedModuli = shuffled.slice(0, 3);
  
  return selectedModuli.map((m) => ({
    id: generateId(),
    b: Math.random() > 0.5 ? "" : String(Math.floor(Math.random() * (m - 1)) + 1),
    a: String(Math.floor(Math.random() * m)),
    m: String(m),
  }));
}

export function CRTForm({ onCalculate }: CRTFormProps) {
  // All input state is managed locally to prevent page re-renders
  const [equations, setEquations] = useState<CRTEquation[]>([
    createEmptyEquation(),
    createEmptyEquation(),
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(equations);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate(equations);
    }
  };

  const updateEquation = useCallback(
    (id: string, field: "b" | "a" | "m", value: string) => {
      setEquations((prev) =>
        prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
      );
    },
    []
  );

  const addEquation = useCallback(() => {
    setEquations((prev) => [...prev, createEmptyEquation()]);
  }, []);

  const removeEquation = useCallback((id: string) => {
    setEquations((prev) => prev.filter((eq) => eq.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEquations([createEmptyEquation(), createEmptyEquation()]);
  }, []);

  const clearCoefficients = useCallback(() => {
    setEquations((prev) => prev.map((eq) => ({ ...eq, b: "" })));
  }, []);

  const useRandomNumbers = useCallback(() => {
    setEquations(generateRandomEquations());
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
      <div className="text-muted-foreground text-sm mb-4">
        Find <span className="font-mono text-foreground">x</span> such that all
        congruences are satisfied simultaneously
      </div>

      {/* Helper buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="gap-1.5"
        >
          <Trash2 className="size-3.5" />
          Clear all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={useRandomNumbers}
          className="gap-1.5"
        >
          <Shuffle className="size-3.5" />
          Random numbers
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearCoefficients}
        >
          Clear coefficients
        </Button>
      </div>

      {/* Equation rows */}
      <div className="space-y-3">
        {equations.map((eq, index) => (
          <EquationRow
            key={eq.id}
            index={index}
            b={eq.b}
            a={eq.a}
            m={eq.m}
            onBChange={(value) => updateEquation(eq.id, "b", value)}
            onAChange={(value) => updateEquation(eq.id, "a", value)}
            onMChange={(value) => updateEquation(eq.id, "m", value)}
            onRemove={() => removeEquation(eq.id)}
            canRemove={equations.length > 2}
          />
        ))}
      </div>

      {/* Add row button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addEquation}
        className="gap-1.5"
      >
        <Plus className="size-3.5" />
        Add equation
      </Button>

      {/* Calculate button */}
      <Button type="submit" className="w-full h-10 text-sm font-medium">
        Calculate
      </Button>
    </form>
  );
}
