"use client";

import { useState, useMemo, useCallback } from "react";
import { generateSteps, type FoldStep, type FoldSequence } from "@/lib/euclid-folding";

export interface UseFolding {
  a: number;
  setA: (v: number) => void;
  b: number;
  setB: (v: number) => void;
  useModulo: boolean;
  setUseModulo: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  playing: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  currentStep: number;
  totalSteps: number;
  steps: FoldStep[];
  gcd: number;
  error: string | null;
  advance: () => void;
  isComplete: boolean;
}

export function useFolding(): UseFolding {
  const [a, setARaw] = useState(34);
  const [b, setBRaw] = useState(55);
  const [useModulo, setUseModuloRaw] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const sequence: FoldSequence = useMemo(
    () => generateSteps(a, b, useModulo),
    [a, b, useModulo],
  );

  const totalSteps = Math.max(0, sequence.steps.length - 1);
  const isComplete = currentStep >= totalSteps;

  const error = useMemo(() => {
    if (sequence.tooMany)
      return "Too many steps — enable Modulo toggle or choose smaller numbers";
    return null;
  }, [sequence.tooMany]);

  const resetPlaybackState = useCallback(() => {
    setPlaying(false);
    setCurrentStep(0);
  }, []);

  const setA = useCallback((v: number) => {
    resetPlaybackState();
    setARaw(v);
  }, [resetPlaybackState]);

  const setB = useCallback((v: number) => {
    resetPlaybackState();
    setBRaw(v);
  }, [resetPlaybackState]);

  const setUseModulo = useCallback((v: boolean) => {
    resetPlaybackState();
    setUseModuloRaw(v);
  }, [resetPlaybackState]);

  const play = useCallback(() => {
    if (!isComplete && !error) setPlaying(true);
  }, [isComplete, error]);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    setPlaying(false);
    setCurrentStep(0);
  }, []);

  const advance = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next > totalSteps) setPlaying(false);
      return Math.min(next, totalSteps);
    });
  }, [totalSteps]);

  return {
    a,
    setA,
    b,
    setB,
    useModulo,
    setUseModulo,
    speed,
    setSpeed,
    playing,
    play,
    pause,
    reset,
    currentStep,
    totalSteps,
    steps: sequence.steps,
    gcd: sequence.gcd,
    error,
    advance,
    isComplete,
  };
}
