import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Folding Segments Visualizer",
  description: "Visualize the Euclidean algorithm by folding segments",
  openGraph: {
    title: "Folding Segments Visualizer",
    description: "Visualize the Euclidean algorithm by folding segments",
    url: "/folding",
    images: [
      {
        url: "/og-image-folding.png",
        width: 1200,
        height: 600,
        alt: "Folding segments Euclidean algorithm visualizer preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folding Segments Visualizer",
    description: "Visualize the Euclidean algorithm by folding segments",
    images: ["/og-image-folding.png"],
  },
};

export default function FoldingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
