# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (installs deps, generates Prisma client, runs migrations)
npm run setup

# Development
npm run dev          # Dev server at localhost:3000 (Turbopack)
npm run dev:daemon   # Dev server in background, logs to logs.txt

# Build & start
npm run build
npm run start

# Lint
npm run lint

# Tests
npm test                            # All tests
npx vitest run src/lib/__tests__/   # Single test directory

# Database
npx prisma migrate dev   # Run migrations
npx prisma generate      # Regenerate Prisma client
npm run db:reset         # Reset database (destructive)
```

**Environment**: Create `.env` with `ANTHROPIC_API_KEY` (optional — falls back to mock provider) and `JWT_SECRET` (optional — defaults to dev key).

## Architecture

This is a Next.js 15 App Router app that generates React components via Claude AI. The UI is a three-panel layout: chat on the left, live preview + Monaco code editor on the right.

### Key data flow

1. User sends a message in the chat → hits `POST /api/chat` (`src/app/api/chat/route.ts`)
2. The route streams a response from Claude (via Vercel AI SDK) using two tools:
   - `str_replace_editor` — creates/modifies files in the virtual file system
   - `file_manager` — directory operations
3. Tool calls are streamed back to the client and applied to the virtual file system (`src/lib/file-system.ts`) — no actual disk writes
4. The preview panel transpiles the virtual files with `@babel/standalone` and renders them live

### State management

Two React contexts (in `src/lib/contexts/`) hold global state:
- **Chat context** — message history, streaming state
- **File system context** — virtual file tree, active file selection

### Authentication & persistence

- JWT sessions stored in HTTP-only cookies (`src/lib/auth.ts`)
- Anonymous use is supported; projects can optionally be saved under a user account
- SQLite via Prisma: `User` and `Project` models (`prisma/schema.prisma`)
- Projects store chat history (`messages`) and file system state (`data`) as serialized JSON strings

### AI provider

`src/lib/provider.ts` wraps `@ai-sdk/anthropic`. When `ANTHROPIC_API_KEY` is absent it falls back to a mock provider that returns canned responses — useful for UI development without API costs.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
