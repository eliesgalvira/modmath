import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "modmath",
    template: "%s | modmath",
  },
  description: "Mathematical calculators with step-by-step explanations",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://modmath.vercel.app",
  ),
  openGraph: {
    title: "modmath",
    description: "Mathematical calculators with step-by-step explanations",
    url: "/",
    siteName: "modmath",
    images: [
      {
        url: "/og-image-inverse.png",
        width: 1200,
        height: 600,
        alt: "modmath modular inverse calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "modmath",
    description: "Mathematical calculators with step-by-step explanations",
    images: ["/og-image-inverse.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} dark`}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
