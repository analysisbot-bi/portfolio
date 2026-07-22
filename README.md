# Vickram Madhavan portfolio

Simple personal site built with plain HTML, CSS, and JavaScript.
Live: https://vickram-madhavan.github.io/

## Files to edit

| What you want to change | File |
|---|---|
| Skills list or featured projects | `content.js` |
| About / experience / contact text | `index.html` |
| Colors, fonts, spacing | `styles.css` (top `:root` section) |
| Site behaviour (form, resume popup) | `script.js` |
| Resume PDF | `assets/resume.pdf` |
| Resume preview image | `assets/resume-page-1.png` |
| Case study write-ups | `projects/supply-chain-analytics.html`, `projects/obesity-ann.html` |

## Add a new featured project

1. Open `content.js`.
2. Copy an existing object inside `projects: [ ... ]`.
3. Change `title`, `desc`, `tech`, `skills`, `caseUrl`, `githubUrl`.
4. Save and refresh the site.

Skill `id` values must match ones in the `skills` array (for example `python`, `sql`).

## Update your resume

1. Put your PDF at `assets/resume.pdf` (same name).
2. Optional: replace `assets/resume-page-1.png` so the on-site preview matches.
3. Commit and push if you use GitHub Pages.

## Deploy (GitHub Pages)

```bash
git add .
git commit -m "Update portfolio"
git push origin master
```

Pages serves from the repo root on the `master` branch of `vickram-madhavan.github.io`.
