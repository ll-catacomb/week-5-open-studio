# ai-lab-week-5

The Learning Lab's AI Lab, week 5 (ending 2026-10-09; the Lab's theme that week is AI for research, dramaturgy, and context packs): **The Notebook**, duplicated from TDM 155AI's week 5 notebook app for the AI Lab. A local Next app that renders two folders of Markdown (our docs and the user's notebook), with lightweight dictation and photo transcription. This is the public copy of the private `ll-26-27/ai-lab-week-5` repo (at `b08c2b9`), with no keys or local media. Planning stays in the mk-27 workbook.

**Copied 2026-10-08 from `tdm155ai/tdm155ai-week-5` at `ae30821`**, every tracked file, with only the names changed (site title, term line, package names, OpenRouter `X-Title`). The content is still the course's: `docs/course-docs/` (the TDM Unit 2 project), `AGENTS.md` (instructions for a student's AI assistant), and the history sections below describe tdm155ai-week-5 until they are rewritten for the AI Lab. Not deployed.

Two folders of Markdown at the repo root, each a section of the site at the same path (`docs/course-docs/how-it-works.md` is `/docs/course-docs/how-it-works`). Every folder is a page showing its `README.md` above a list of what it holds; names starting with `_` or `.` are skipped.

- **`docs/`**: what we prepared for the week, in four parts. `docs/README.md` can set `print_set:` for `/print/set`.
  - **`docs/course-docs/`**: the Unit 2 project (`unit-2-project.md`, from week 4's draft) and how the workbook works.
  - **`docs/how-to/`**: Claude's ideas on how to make the student's project.
  - **`docs/ai-research/`**: essays and research written with AI, starting with `notetaking-and-workbooks/`. Every page here carries an "AI-generated" label.
  - **`docs/readings/`**: the reading still to do.
- **`notebook/`**: the student's own work. Dictated and photographed notes are written here, one file each, named `<yyyymmdd-hhmm>-<title>.md`, newest first; anything else added here is a page too.
- **`_media/dictation/`**: gitignored, local only. Each recording (`<id>.wav`, 16 kHz mono) with a `<id>.json` beside it holding the raw transcript, the models, and which note it became.
- **`utils/`**: the image and text generation scripts from weeks 2 and 4, for OpenRouter, fal, and HUIT. Run them from the repo root with the keys in the root `.env`; see [utils/README.md](utils/README.md). What they make lands in `output/` (gitignored).
- **`nextjs/`**: the app: forced dark, Inter, with a red accent; `/print` is always light.

`AGENTS.md` (read by Claude through `CLAUDE.md`) tells a student's AI assistant what the repo is for, the week 5 process (an AI-enhanced notebook for the Unit 2 project, starting with how-to docs in `docs/how-to/`), where things go, and to mark what it writes `author: claude`.

Frontmatter (all optional): `title`, `description`, `eyebrow`, `updated`, `order`. Each folder's README sets `step:` (with `subtitle`, and optionally `tool`, `tool_title`), which makes it a numbered step on the home page.

| URL | What |
| --- | --- |
| `/` | The two folders as steps, the tools, and a map of everything |
| `/docs/...`, `/notebook/...` | Any folder or document in `docs/` or `notebook/` |
| `/dictate` | Record a note (button or space bar), with an optional line of context. The recording is saved, transcribed by `TRANSCRIBE_MODEL`, cleaned up by `CLEANUP_MODEL`, and written to `notebook/`. |
| `/transcribe` | Photograph pages with the camera or upload images; a faithful transcription is written to `notebook/` (see below). |
| `/graphics` | Lower thirds, titles, and corner bugs, exported as PNGs (see [Graphics and recording](#graphics-and-recording-2026-10-08)) |
| `/graphics/record` | The webcam with a graphic on top, recorded to `_media/recordings/` |
| `/print` | Light print versions on Letter (the one light surface): put `/print` in front of any page's address, or `/print/all` |

## Run it

Use Node 22 or later (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

Then open the localhost address it prints. Recording needs Chrome or Safari on the same machine (the microphone requires localhost or HTTPS).

Copy `nextjs/.env.example` to `nextjs/.env.local` and set `OPENROUTER_API_KEY` (`FAL_API_KEY` and `HUIT_API_KEY` are there too, unused by the app so far). The root `.env.example` (copy to `.env`) has the same three keys for scripts run from the repo root. Without it, `/dictate` and `/transcribe` ask for the user's own OpenRouter key, keep it in that browser (localStorage), and send it with each request in an `X-OpenRouter-Key` header; the server uses it for that request only and never writes it to disk. With no key at all, recordings and photographs are saved but not transcribed. The models default to `google/gemini-3.8-flash` (transcription; it has to accept audio) and `anthropic/claude-sonnet-5.5` (cleanup). Restart `pnpm dev` after editing it.

The app reads and writes the local disk, so it is built to run on a laptop. On Vercel (root directory `nextjs`) the `docs/` pages and `/print` work, but dictation and transcription can't be saved.

## How a recording becomes a note

1. The browser records with `MediaRecorder`, then decodes and resamples the audio to 16 kHz mono WAV, which every audio model on OpenRouter accepts.
2. `/api/dictate` saves the WAV to `_media/dictation/` first, so a failed model call never loses it.
3. The audio model transcribes it word for word (`lib/dictate.mjs`).
4. The text model turns the transcript into a titled Markdown document, keeping the speaker's words and adding nothing they didn't say. If this step fails, the note is written with the raw transcript.

## Where this came from

Created 2026-10-04 with a README and `content/`. On 2026-10-07 it became a workbook app: the docs reader and dictation come from `ll-26-27/mk-video-note-machine` (`6edef79`, without `/interview`), and the `/context` mount from `ll-26-27/ll-week-5-interface` (`27c839a`), pointed at this repo's own `_context/` instead of the parent's. The `/capture` route was renamed `/dictate`, and notes initially went to `_context/dictation/` instead of `content/notes/`. Later that day `content/` moved from `nextjs/` to the repo root.

## Notebook: voice and photographs (2026-10-07)

`/dictate` and `/transcribe` both write new Markdown files into `notebook/`, displayed at `/notebook`. The old `/context/notebook` and `/context/dictation` addresses redirect there.

`/transcribe` accepts live webcam photographs or uploaded JPEG, PNG, and WebP images, with previews, removal, and page ordering. It preserves the photographed wording, marks illegible text, and embeds the source photographs below the transcription. Originals and the model output are kept in the gitignored `_media/notebook/` folder before a note is written. Set `PHOTO_TRANSCRIBE_MODEL` to an image-input OpenRouter model; it falls back to `TRANSCRIBE_MODEL`.

Limits: 12 images, 10 MB per image, 30 MB total. The API rejects other formats and uses generated filenames. Both capture flows require a local writable filesystem; a static deployment does not persist notebook entries.

## Docs and Notebook (2026-10-07)

Later on 2026-10-07 `content/` and `_context/` were replaced by three folders split by who wrote them (Marlon): `docs/` (our instructions, from `content/README.md` and `content/guides/`), `ai/` (AI-generated essays, from `content/notetaking-and-workbooks/`), and `notebook/` (the student's own work, from `_context/notebook/`). The same day `ai/` folded back into `docs/` (Marlon: no "ai" folder or homepage section): `docs/ai-research/` (from `ai/`), `docs/readings/` (reading still to do), `docs/how-to/` (Claude's ideas for the project), and `docs/course-docs/` (from `docs/guides/`, plus the Unit 2 project). Old addresses (`/guides/...`, `/docs/guides/...`, `/ai/...`, `/notetaking-and-workbooks/...`, `/context/...`) redirect to the new ones.

## Homepage Notebook wink (2026-10-07)

The homepage links to Notebook with a small cinematic joke. Its discreet `gosling` button mounts the supplied YouTube video as a looping, muted, viewport-filling background behind the page. Sound on/off, a close button, and Escape control the detour. Closing it or leaving the page removes the iframe and stops playback. No player is loaded before the button is pressed. Embed parameters follow [YouTube’s player documentation](https://developers.google.com/youtube/player_parameters).

The background now uses the unletterboxed video `jefNSYYFm5w`, with Sun mode (0:33–2:12 / 33–132 seconds) and Rain mode (2:29–4:09 / 149–249 seconds). The mode toggle and Sound on/off sit beside `gosling`. Switching modes jumps to the selected section, and the IFrame Player API reloads that same bounded section at the end; native YouTube playlist looping restarts at 0:00. The cinema-wide footage is still contained inside YouTube’s 16:9 player, so cover sizing crops the player’s empty bands and follows the viewport container for portrait, landscape, and ultrawide screens.

For the brightness preview, the background’s dark green-black overlay was changed from 63% opacity to 0% on 2026-10-07.

## Graphics and recording (2026-10-08)

**Copied 2026-10-08 from `ll-26-27/graphic-tools-for-blue` at `499e11d`** (its `nextjs/`) into this app at `/graphics`: the editor at `/graphics`, the PNG renderer at `/api/graphics/render`, the model and fonts in `nextjs/lib/graphics/`, and the shaders in `nextjs/app/graphics/effects/`. Its browser storage keys were renamed, and two things were added:

- **Camera** (`/graphics`, Camera section): Show camera puts the live camera behind the graphic in the preview (`app/graphics/webcam-layer.tsx`); off, you see the background. Choose the camera and whether to mirror it. Turning the camera on hides the graphic; `G`, the Show the graphic toggle, or launching a saved graphic brings it in with a short fade. Live shaders stay on over the camera, screen-blended so their black drops out and the glow shows. Not saved: the camera starts off on every load.
- **`/graphics/record`**: the webcam with a graphic on top, drawn into one 1920×1080 canvas and recorded with `MediaRecorder` (MP4 where the browser supports it, otherwise WebM), with the microphone. The overlay is the PNG the editor exports, with the background forced to None and shaders left out. Pick the editor's current graphic or any saved one; the page follows the editor live when both are open in tabs. `G` brings the graphic in and out (a short fade), `R` starts and stops, `0` and `1`–`9` switch graphics. The camera can be mirrored; the text never is. Keep the tab in front while recording, because browsers slow hidden tabs.
- **Extra properties** for each live effect, from `graphic-tools-for-blue`'s `mac_pro` branch (`5e5bc2b`, merged 2026-10-08): an expandable box of tunables per shader (splash decay, swirl, force; strands speed, amplitude, position, rotation; ghost trail, drift, fade, bloom; rain speed, trail, size, depth), saved in the spec and applied without restarting the animation.
- **Rain** (a live effect beside Splash, Strands, and Ghost; `nextjs/app/graphics/effects/GlyphRain.tsx`): glyph rain on a 2D canvas that tracks every cell. Each column keeps its characters and each drop its head, speed, and trail; glyphs are drawn once into an atlas with the glow baked in and copied with `drawImage`, under an additive blend. Settings: glyphs (katakana, binary, hex, Greek, IPA, or the graphic's own text), fall speed, trail length, glyph size, a dimmer depth layer, plus the effect color or rainbow. Drops near the pointer slow down (bullet time), and a click starts a burst that fans out from the click. Not from React Bits; written here.
- **`/api/graphics/recordings`**: saves each take to the gitignored `_media/recordings/` at the repo root, named `<yyyymmdd-hhmmss>[-title].mp4`. Each take can also be played and downloaded from the page.

**A simpler version than the original (2026-10-08):** people preview on their laptops, so the second-monitor display window (`/graphics/viewer`, the View here / Open display window switch, Fill monitor and Full screen) and the safe-area guides were removed here. `graphic-tools-for-blue` keeps both.

The graphics pages are TypeScript and Tailwind, unlike the rest of the app. `app/graphics/graphics.css` loads Tailwind without its global reset (preflight) and generates utilities only from `app/graphics/`, with a small reset under `.graphics-root` instead, all in cascade layers, so the notebook's own styles are unchanged. The camera needs localhost or HTTPS. (Earlier the same day the graphics were briefly a second app in `graphics/` on port 3001.)
