import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chinese Remainder Theorem Calculator",
  description: "Solve systems of linear congruences with step-by-step CRT explanations",
};

export default function CRTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
