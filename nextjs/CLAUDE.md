@AGENTS.md

# ai-lab-week-5 app

A Next app that renders the Markdown in the repo's root `docs/` and `notebook/` at the same paths (`lib/content.mjs`), plus `/dictate` (`lib/dictate.mjs`, `app/api/dictate/`) and `/transcribe` (`lib/photos.mjs`, `app/api/transcribe/`), which write notes to `notebook/` using models on OpenRouter, and a light `/print`. See the repo `README.md`.

Keep keys in `.env.local` (gitignored). When it has no `OPENROUTER_API_KEY`, the two capture pages ask for the user's own key (`app/components/ApiKeyField.jsx`), which is kept in the browser and sent per request in the `X-OpenRouter-Key` header; never save or log it on the server.
