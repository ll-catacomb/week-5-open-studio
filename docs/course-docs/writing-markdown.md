---
title: Writing Markdown here
description: Frontmatter, links, images, and video in docs/ and notebook/.
order: 2
---

# Writing Markdown here

Any `.md` file in `docs/` or `notebook/` is a page. A folder's `README.md` is the top of that folder's page.

## Frontmatter

All optional:

```yaml
---
title: The page title (otherwise the first # heading, otherwise the filename)
description: One line under the title, and on lists
eyebrow: The small label above the title
updated: 2026-10-05
order: 1
---
```

## Links and media

- Relative links between `.md` files work as they do on GitHub: [back to how it works](how-it-works.md).
- An image path is relative to the document, so keep pictures next to the `.md` that shows them.
- A YouTube link, or a `.mp4` or `.mp3` address, written as an image becomes a player.

> Tables, task lists, and strikethrough work too (GitHub-flavored Markdown).

- [x] Write a page
- [ ] Dictate a note
