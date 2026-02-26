# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**modmath** is a client-side-only Next.js 16 web app providing math calculators (modular inverse, CRT, folding visualizer). No backend, no database, no external APIs.

### Runtime

- Node.js version is pinned in `.node-version` (currently 24.12.0). Use `nvm` to install/switch.
- Package manager: **pnpm** (enabled via `corepack enable pnpm`).

### Common commands

See `package.json` scripts. Key ones:

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (port 3000) |
| Lint | `pnpm lint` |
| Build | `pnpm build` |

### Notes

- The `pnpm install` warning about `msw` ignored build scripts is expected; the `pnpm-workspace.yaml` already has `ignoredBuiltDependencies` for `sharp` and `unrs-resolver`, and `msw` does not need its build script for dev.
- There are no automated tests (no test script in `package.json`). Validation is done via lint, build, and manual browser testing.
- All three routes (`/`, `/crt`, `/folding`) are statically generated and purely client-side.
