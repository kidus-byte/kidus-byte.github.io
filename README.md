# Kidus | Personal Portfolio

A static, immersive portfolio built with plain HTML, CSS and JavaScript (GSAP + Three.js from CDNs).
No build step. The visual system is documented in [`DESIGN.md`](./DESIGN.md).

## Run locally

Open the folder with a local server (fonts and the Three.js module need an HTTP origin):

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Publish on GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

Name the repo `YOUR_USERNAME.github.io` for a root URL, or use any repo name and enable
**Settings -> Pages -> Deploy from branch -> main / (root)**.

## Customize

- Replace the email, GitHub and YouTube links in the Contact section of `index.html`
  (`data-email` on the copy button, plus the two links next to it).
- Add live-demo or repo links to the project cards (a commented example is in the first card).
- Colors, fonts and motion rules live in `DESIGN.md`; the CSS variables are at the top of `styles.css`.
- Hero cards are the `.star` blocks in `index.html`; position them with the `--l` / `--t` / `--z` values.

## Performance notes

One WebGL scene only, paused when off-screen. Mobile, low-core devices and `prefers-reduced-motion`
get lighter fallbacks (static orb, stacked scenes, no scroll-driven animation).
