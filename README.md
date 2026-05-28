# Backend OIC

Backend service for the OIC (Órgano Interno de Control) platform, built with [NestJS](https://nestjs.com/) + GraphQL + MongoDB.

## Prerequisites

- **Node.js** ≥ 16
- **pnpm** ≥ 9 (see [Security](#security) for why we use pnpm)
- **MongoDB** running locally or accessible via connection string

## Installation

```bash
# Install dependencies (scripts are disabled by default — see .npmrc)
pnpm install --ignore-scripts

# Rebuild native dependencies explicitly (bcrypt)
pnpm rebuild bcrypt
```

> **Why `--ignore-scripts`?** All post-install scripts are disabled globally via `.npmrc` to prevent supply chain attacks. Native packages like `bcrypt` must be rebuilt manually after install.

## Environment

Copy the example env and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_PORT` | Server port | `3000` |
| `MONGO_CNN` | MongoDB connection string | `mongodb://root:123456@localhost:27017` |
| `PASSPHRASE_SSL` | SSL certificate passphrase | *(your passphrase)* |

## Running the App

```bash
# Development (watch mode)
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Production
pnpm run build
pnpm run start:prod
```

## Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## Adding Dependencies

Always install with exact versions and scripts disabled:

```bash
# ✅ Correct — exact version, no scripts
pnpm add <package>@<exact-version> --ignore-scripts

# ❌ Wrong — never use @latest or loose ranges
pnpm add <package>@latest
```

After adding a package that requires native compilation, add it to `onlyBuildDependencies` in `pnpm-workspace.yaml` and run `pnpm rebuild <package>`.

---

## Security

This project applies a **Defense in Depth** strategy for NPM supply chain security. All configurations are documented in [seguridad.md](./seguridad.md).

### Layers of Protection

| Layer | File | What It Does |
|-------|------|-------------|
| **Script blocking** | `.npmrc` | `ignore-scripts=true` — prevents automatic execution of `postinstall` and similar hooks |
| **Audit on install** | `.npmrc` | `audit=true` — runs `npm audit` automatically on every install |
| **Cooldown window** | `pnpm-workspace.yaml` | `minimumReleaseAge: 4320` — rejects packages published less than 3 days ago |
| **Build allow-list** | `pnpm-workspace.yaml` | `strictDepBuilds: true` + `onlyBuildDependencies` — only `bcrypt` can run native builds |
| **Publish guard** | `package.json` | `files: ["dist/", "README.md"]` — limits what gets published (defense in depth even though `private: true`) |
| **Secret protection** | `.gitignore` | `.env`, `.npmrc.local`, `.pnpm-store/` excluded from version control |
| **Lockfile integrity** | `pnpm-lock.yaml` | pnpm's content-addressable store mitigates lockfile URL injection attacks |

### Quick Reference

```bash
# ✅ Install dependencies safely
pnpm install --ignore-scripts

# ✅ Rebuild native packages after install
pnpm rebuild bcrypt

# ✅ Add a new dependency (always exact version)
pnpm add <pkg>@1.2.3 --ignore-scripts

# ✅ Verify lockfile integrity
pnpm install --frozen-lockfile --ignore-scripts

# ❌ NEVER do this
pnpm add <pkg>@latest
npm install  # use pnpm, not npm
```

### When a New Native Package Is Needed

1. Add it: `pnpm add <package>@<version> --ignore-scripts`
2. Add the package name to `onlyBuildDependencies` in `pnpm-workspace.yaml`
3. Rebuild: `pnpm rebuild <package>`
4. Verify it works: `pnpm run build`

## License

Private — UNLICENSED

