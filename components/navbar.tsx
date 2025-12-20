"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const navLinks = [
  { href: "/", label: "Modular Inverse" },
  { href: "/crt", label: "Chinese Remainder Theorem" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleNavigation = (href: string) => {
    if (href === pathname) return;
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  // Clear pending state when navigation completes
  useEffect(() => {
    if (!isPending) {
      setPendingHref(null);
    }
  }, [isPending]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:text-foreground/80 transition-colors"
        >
          modmath
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isLoading = isPending && pendingHref === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                disabled={isLoading}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors rounded-sm relative",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className={cn(isLoading && "invisible")}>
                  {link.label}
                </span>
                {isLoading && (
                  <Loader2 className="size-4 animate-spin absolute inset-0 m-auto" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
