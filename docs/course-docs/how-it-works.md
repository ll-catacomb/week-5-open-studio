---
title: How it works
author: codex
description: Voice recordings and photographs become Markdown entries in your Notebook.
order: 1
---

# How it works

[Dictate](/dictate) and [Transcribe](/transcribe) both save Markdown documents into your [Notebook](/notebook).

## Dictate a note

1. Press record (or the space bar), talk, and press again to stop.
2. An audio model transcribes the recording word for word.
3. A text model removes filler and false starts, adds headings where useful, and keeps your meaning. If cleanup fails, the raw transcript is saved as the note instead.

The original recording and raw transcript stay in the local `_media/dictation/` folder.

## Photograph your notes

1. Turn on the camera and take photographs, or upload JPEG, PNG, or WebP images.
2. Check the previews. Remove unwanted images or use Move up to put the pages in order.
3. Select Transcribe to Notebook. An image model reads the pages in that order, preserving their wording and marking unclear writing.

You can send up to 12 images, at most 10 MB each and 30 MB total. Export HEIC images as JPEG before uploading. The source photographs appear under the transcription; check uncertain words against them.

Photographs and their transcription records stay in `_media/notebook/`, even if the model call fails. A failed transcription keeps the selected images on screen so you can try again.

## Your Notebook

Each successful submission writes a new `.md` file in `notebook/`, with a title, date, and source type. New notes never overwrite earlier ones. Open the Notebook to read or print the notes, or edit the Markdown files directly.

The app reads and writes local files, so capture runs on the laptop hosting it. Media folders are gitignored; keep them with the Markdown if you want the photographs available later.

## Settings

Set these in `nextjs/.env.local` and restart the app after changing them:

| Setting | What it does |
| --- | --- |
| `OPENROUTER_API_KEY` | Used to transcribe. Without it, Dictate and Transcribe ask for your own OpenRouter key, which stays in your browser. With no key at all, audio and images are saved, but no Markdown note is created. |
| `TRANSCRIBE_MODEL` | Audio transcription model. |
| `CLEANUP_MODEL` | Text model for cleaning up dictated notes. |
| `PHOTO_TRANSCRIBE_MODEL` | Image-input model for photographed notes; defaults to `TRANSCRIBE_MODEL`. |
