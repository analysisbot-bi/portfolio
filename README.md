# Vickram Madhavan — CS Portfolio

A clean, modern, fully responsive single-page portfolio for Vickram Madhavan,
MSc Computer Science student specializing in Big Data analysis & machine learning.
Built with plain HTML, CSS, and vanilla JavaScript — **no build step, no
dependencies**. Just open it in a browser.

## Features

- Modern dark theme with animated grid + glow background
- Sticky navbar with scroll state and a mobile hamburger menu
- Scroll-reveal animations and animated stat counters
- Sections: Hero, About, Skills, Projects, Experience/Education, Contact
- Accessible form with floating labels and client-side validation
- Respects `prefers-reduced-motion`
- Responsive down to small phones

## Project structure

```
portfolio/
├── index.html        # Markup / content
├── styles.css        # All styling and theme tokens
├── script.js         # Nav, reveal animations, counters, form
├── assets/
│   └── resume.txt    # Placeholder — replace with your resume.pdf
└── README.md
```

## Run it

Just open `index.html` in your browser. Or serve it locally:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Make it yours

1. **Text & links** — edit `index.html`. Update the bio, project descriptions,
   experience, and the GitHub/email links (your LinkedIn is already wired in).
2. **Resume** — drop your `resume.pdf` into `assets/` and update the nav link.
3. **Colors** — tweak the CSS variables at the top of `styles.css`
   (`--accent`, `--accent-2`, `--bg`, etc.).
4. **Projects** — duplicate a `<article class="project">` block to add more.
5. **Contact form** — currently a front-end demo. To actually receive messages,
   point the form at a service like [Formspree](https://formspree.io) or your
   own backend endpoint.

## Deploy (free)

- **GitHub Pages**: push to a repo, enable Pages on the `main` branch.
- **Netlify / Vercel**: drag-and-drop the folder, or connect the repo.
