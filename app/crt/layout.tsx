import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chinese Remainder Theorem Calculator",
  description: "Solve systems of linear congruences with step-by-step CRT explanations",
  openGraph: {
    title: "Chinese Remainder Theorem Calculator",
    description:
      "Solve systems of linear congruences with step-by-step CRT explanations",
    url: "/crt",
    images: [
      {
        url: "/og-image-sunzi.jpg",
        width: 1200,
        height: 600,
        alt: "Chinese Remainder Theorem calculator preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese Remainder Theorem Calculator",
    description:
      "Solve systems of linear congruences with step-by-step CRT explanations",
    images: ["/og-image-sunzi.jpg"],
  },
};

export default function CRTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
