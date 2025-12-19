"use client";

import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-sm font-medium text-destructive">
            No Inverse Exists
          </div>
          <div className="text-sm text-muted-foreground">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

