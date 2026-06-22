# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Date Site

Personal static website for inviting my girlfriend on dates and storing memories of past ones. Built by me (Android dev, new to web) with Claude Code doing the heavy lifting.

## Stack

- **Framework**: Astro (static site, no SSR)
- **Styling**: vanilla CSS with custom properties. No Tailwind, no UI libraries.
- **Hosting**: GitHub Pages via GitHub Actions
- **Past dates**: one markdown file per date in `src/content/dates/`
- **Current invitation**: single JSON in `src/content/invitation.json`
- **RSVP backend**: **Supabase** (chosen at first invitation). Inserts into `invitation_responses` table; live status visible at `/status`. See `create-invitation` skill for SQL schema.
- **Language**: UI copy is in Russian; code, identifiers, and commit messages in English.

## Commands

| What                       | Command                       |
| -------------------------- | ----------------------------- |
| Local dev server           | `npm run dev` (port 4321)     |
| Production build           | `npm run build`               |
| Preview production locally | `npm run build && npm run preview` |
| Deploy                     | `git push origin main` (Actions runs the rest) |

Always run `npm run build && npm run preview` before pushing — it catches issues `dev` doesn't (the `base` path, missing env vars, broken links).

## Architecture

```
src/
├── pages/
│   ├── index.astro              # landing
│   ├── invitation.astro         # current invitation (girlfriend's entry point)
│   ├── status.astro             # private — shows RSVP response (Supabase setup only)
│   └── history/
│       ├── index.astro          # list of past dates
│       └── [slug].astro         # individual date page
├── components/                  # GlassCard, Hero, PhotoFrame, Timeline, RsvpForm, etc.
├── content/
│   ├── dates/                   # one .md per past date
│   ├── invitation.json          # current invitation (single source of truth; imported directly, NOT a collection)
│   └── archived-invitations/    # past invitations that didn't become history entries
├── styles/
│   └── tokens.css               # design tokens — see visual-design skill
└── content.config.ts            # Astro collection schemas — only `dates` is a collection

public/
└── photos/
    ├── dates/<slug>/            # photos per date
    └── invitations/<id>/        # photos per invitation
```

`invitation.json` is loaded in pages via a direct `import` statement, not through `getCollection`. The `content.config.ts` only defines the `dates` collection.

## Environment variables

```
# .env (never commit; keep .env.example in sync)
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

These must also be added as **GitHub Actions secrets** (repo → Settings → Secrets and variables → Actions) for the CI build.

## Conventions

- **Mobile-first.** She views on her phone. Test at 375px width before anything else.
- **Aesthetic is fixed:** modern romantic, soft gradients, glassmorphism, generous whitespace. Consult the `visual-design` skill **before any UI change**.
- **No frameworks beyond Astro.** No React, no Tailwind. Keep the dependency tree small.
- **Photos go through Astro's `<Image>` component**, never raw `<img>`. Source photos in `public/photos/...`.
- **One logical change per commit.** Commit messages in English, lowercase, conventional-ish (`add:`, `fix:`, `style:`).

## User context — this matters

I'm an Android developer with **zero web experience**. When explaining code, debugging confusion, or introducing a new tool, use Android/Kotlin/Compose analogies. See the `explain-web-to-android-dev` skill — load it whenever I ask "what does this mean", "why is it doing that", or seem confused.

Don't lecture me on HTML/CSS history. I learn fast; I just haven't seen this stack.

## First-run checklist

When starting the project from an empty folder:

1. `npm create astro@latest .` — pick "Empty", TypeScript, install deps
2. Create the directory structure above (`mkdir -p src/{components,content/dates,content/archived-invitations,styles} public/photos/{dates,invitations}`)
3. Create `src/content.config.ts` with the `dates` collection only (the `add-date` skill has the exact schema)
4. Create `src/styles/tokens.css` from the `visual-design` skill
5. Set up the GitHub Actions workflow (`deploy-to-pages` skill)
6. Configure `astro.config.mjs` with `site` and `base` (`deploy-to-pages` skill)
7. Commit, push, verify deployment works with an empty homepage before building real content
