# Modular Inverse Calculator

A web-based calculator that finds the modular multiplicative inverse using the Extended Euclidean Algorithm, with step-by-step visualization of the Bézout identity table.

![Dark mode calculator interface](https://img.shields.io/badge/theme-dark-1a1a1a) ![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## What It Does

Given two positive integers `a` and `m`, finds `x` such that:

```
ax ≡ 1 (mod m)
```

The modular inverse exists if and only if `gcd(a, m) = 1`.

## Features

- **Step-by-step visualization** — Displays the complete Extended Euclidean Algorithm table
- **Bézout identity** — Shows coefficients `s` and `t` where `as + mt = gcd(a, m)`
- **Human-readable explanations** — Each algorithm step explained in plain language
- **Input validation** — Clear error messages for invalid inputs
- **No inverse handling** — Explains why when `gcd(a, m) ≠ 1`
- **Copy to clipboard** — One-click copy of the result
- **Dark mode** — Easy on the eyes
- **Idempotent calculations** — Repeated clicks with same inputs cause no re-renders

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [TypeScript](https://www.typescriptlang.org/) — Type safety

> shadcn starting project configuration [here](https://ui.shadcn.com/create?base=base&style=lyra&baseColor=neutral&theme=amber&iconLibrary=lucide&font=roboto&menuAccent=subtle&menuColor=default&radius=default&item=preview)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd modmath

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main calculator page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # shadcn components
│   ├── calculator-form.tsx # Input form
│   ├── result-card.tsx     # Result display with copy button
│   ├── steps-table.tsx     # Bézout identity table
│   ├── step-explanation.tsx# Text walkthrough
│   └── error-alert.tsx     # Error display
├── hooks/
│   └── use-inverse-calculator.ts  # State management
├── lib/
│   ├── extended-euclidean.ts      # Algorithm implementation
│   ├── validators.ts              # Input validation
│   └── utils.ts                   # Utilities
└── types/
    └── index.ts            # TypeScript interfaces
```

## Algorithm

The Extended Euclidean Algorithm computes:
1. `gcd(a, m)` — the greatest common divisor
2. Bézout coefficients `s` and `t` such that `as + mt = gcd(a, m)`

If `gcd(a, m) = 1`, then `s` is the modular inverse (normalized to `[0, m-1]`).

### Example

For `a = 7`, `m = 26`:

| Step | a  | b  | q | r | s   | t  |
|------|----|----|---|---|-----|----|
| 1    | 7  | 26 | 0 | 7 | 1   | 0  |
| 2    | 26 | 7  | 3 | 5 | -3  | 1  |
| 3    | 7  | 5  | 1 | 2 | 4   | -1 |
| 4    | 5  | 2  | 2 | 1 | -11 | 3  |
| 5    | 2  | 1  | 2 | 0 | 26  | -7 |

Result: `7 x 15 ≡ 1 (mod 26)` where `15 = -11 mod 26`

## License

MIT
