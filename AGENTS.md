# The Notebook: instructions for AI assistants

This repository is a student's notebook for TDM 155AI (*Making Stuff in the Age of AI*), week 5: Research. In week 5 each student builds an **AI-enhanced notebook for their first project**, the Unit 2 project: choosing a form of media they want to learn to make (a music video, a documentary, a website, a cooking video, …), then researching it, learning it, and prototyping it with AI's help. The notebook carries the project through October: studies in week 6, editing in week 7, and talking about the piece on the podcast in week 8.

**Before helping, read [`docs/course-docs/unit-2-project.md`](docs/course-docs/unit-2-project.md)** (the assignment, week by week) and the student's [`notebook/`](notebook/README.md) (what they're making and what they've noticed so far). If you don't know what they're making yet, ask.

## Where things go

- **`docs/how-to/`**: tutorials you write for the student's project, one Markdown file per technique (`docs/how-to/lip-sync-to-playback.md`). **This is week 5's task:** the student asks you to think about what they want to make and write how-to docs for the parts they'll need to learn. Make each one practical, with steps they can practice in next week's studies, what to look for when it goes well or badly, and sources they can follow up. Say where you're unsure.
- **`docs/ai-research/`**: longer research you write about the form, its history and conventions, or the world of the piece. Cite sources the student can check.
- **`docs/readings/`**: the reading the student still needs to do, one file per item: a link, where it came from, and why it matters.
- **`docs/course-docs/`**: the course's instructions. Don't edit them unless asked.
- **`notebook/`**: the student's own work: their notes, plans, observations, and the notes they dictate on `/dictate` or photograph on `/transcribe`. It's theirs. Don't rewrite or delete their notes; add to the notebook only when they ask, and say what you added.

## Writing docs

Every Markdown file you write starts with YAML frontmatter that gives its title, a one-line description, and you as its author, so the student (and anyone reading) can tell your work from theirs:

```yaml
---
title: Lip-syncing to playback
description: How to shoot a performance that matches the song, and how to practice it.
author: claude
---
```

Each file is a page in the notebook's site at the same path (`docs/how-to/lip-sync-to-playback.md` is `/docs/how-to/lip-sync-to-playback`). Relative links between `.md` files work, and an image saved beside a doc shows in it.

## The app and the scripts

- The site is a Next app in `nextjs/`. The student runs it themselves: `cd nextjs`, `pnpm install`, `pnpm dev`. Don't start it in the background.
- `/graphics` is a graphics editor (lower thirds, titles, corner bugs) and `/graphics/record` records the webcam with a graphic on top into `_media/recordings/`. They are TypeScript and Tailwind (`app/graphics/`, `lib/graphics/`), while the rest of the app is plain JavaScript and its own CSS; keep Tailwind inside `app/graphics/`.
- `utils/` has scripts for generating text and images through OpenRouter, fal, and Harvard's HUIT gateways; see [`utils/README.md`](utils/README.md). Run them from the repo root. What they make lands in `output/`.
- Keys live in `.env` (for `utils/`) and `nextjs/.env.local` (for the app). Never print, copy, or commit them.
