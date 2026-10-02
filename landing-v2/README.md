# renTent

A Next.js codebase, originally scaffolded by cloning an existing site's design and then developed further by hand.

**Recommended: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with Opus 4.8** — but the project also carries config for a variety of other AI coding agents (see [Supported Platforms](#supported-platforms)).

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start your AI agent** — Claude Code recommended:
   ```bash
   claude --chrome
   ```
3. **Start developing**

> Using a different agent? Open `AGENTS.md` for project instructions — most agents pick it up automatically.

## Supported Platforms

| Agent                                                         | Status                     |
| ------------------------------------------------------------- | -------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **Recommended** — Opus 4.8 |
| [Codex CLI](https://github.com/openai/codex)                  | Supported                  |
| [OpenCode](https://opencode.ai/)                              | Supported                  |
| [GitHub Copilot](https://github.com/features/copilot)         | Supported                  |
| [Cursor](https://cursor.com/)                                 | Supported                  |
| [Windsurf](https://codeium.com/windsurf)                      | Supported                  |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)     | Supported                  |
| [Cline](https://github.com/cline/cline)                       | Supported                  |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code)            | Supported                  |
| [Continue](https://continue.dev/)                             | Supported                  |
| [Amazon Q](https://aws.amazon.com/q/developer/)               | Supported                  |
| [Augment Code](https://www.augmentcode.com/)                  | Supported                  |
| [Aider](https://aider.chat/)                                  | Supported                  |

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- An AI coding agent (see [Supported Platforms](#supported-platforms))

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — icon library

## Project Structure

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # SVG icons
  lib/utils.ts      # cn() utility
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/
  videos/
  seo/              # Favicons, OG images
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
GEMINI.md           # Gemini CLI config (imports AGENTS.md)
```

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint check
npm run typecheck # TypeScript check
npm run check  # Run lint + typecheck + build
```

### If using docker

```bash
docker compose up app --build # build and run the app
docker compose up dev --build # run the app in dev mode on port 3001
```

## Updating Agent Instructions

`AGENTS.md` is the single source of truth for project conventions. Some agents (Cline/Roo Code, Continue, Amazon Q, GitHub Copilot Chat) read from a generated copy instead of `AGENTS.md` directly — after editing `AGENTS.md`, update `.clinerules`, `.continue/rules/project.md`, `.amazonq/rules/project.md`, and `.github/copilot-instructions.md` to match. Agents that read `AGENTS.md` natively (Codex CLI, OpenCode, Cursor, Windsurf, Roo Code, Aider, Augment Code) need no extra step.

## License

MIT
