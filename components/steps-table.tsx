"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Step } from "@/types";
import { cn } from "@/lib/utils";

interface StepsTableProps {
  steps: Step[];
}

export function StepsTable({ steps }: StepsTableProps) {
  if (steps.length === 0) {
    return null;
  }

  // Skip the first row (initialization) and show from step 1 onwards for the algorithm steps
  const displaySteps = steps.slice(1);
  
  if (displaySteps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Extended Euclidean Algorithm Steps</div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center w-16">Step</TableHead>
              <TableHead className="text-center font-mono">a</TableHead>
              <TableHead className="text-center font-mono">b</TableHead>
              <TableHead className="text-center font-mono">q</TableHead>
              <TableHead className="text-center font-mono">r</TableHead>
              <TableHead className="text-center font-mono">s</TableHead>
              <TableHead className="text-center font-mono">t</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySteps.map((step, index) => {
              const isLastRow = index === displaySteps.length - 1;
              const isFinalGcdRow = step.r === 0;
              
              return (
                <TableRow
                  key={step.step}
                  className={cn(
                    "transition-colors",
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/20",
                    isFinalGcdRow && "bg-primary/10 hover:bg-primary/15"
                  )}
                >
                  <TableCell className="text-center font-medium">
                    {step.step}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {step.a}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {step.b}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {step.q}
                  </TableCell>
                  <TableCell className={cn(
                    "text-center font-mono",
                    isFinalGcdRow && "font-bold text-primary"
                  )}>
                    {step.r}
                  </TableCell>
                  <TableCell className={cn(
                    "text-center font-mono",
                    isLastRow && step.r !== 0 && "font-bold"
                  )}>
                    {step.s}
                  </TableCell>
                  <TableCell className={cn(
                    "text-center font-mono",
                    isLastRow && step.r !== 0 && "font-bold"
                  )}>
                    {step.t}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Legend:</span>{" "}
        q = quotient (⌊a/b⌋), r = remainder (a mod b), s and t = Bézout coefficients
      </div>
    </div>
  );
}

