# BrandEdge Studio Portfolio

A static portfolio website built with HTML, CSS, and JavaScript.

## Project files

- `index.html` is the website entry point.
- `brandedge.css` contains page styling and responsive layouts.
- `brandedge.js` powers navigation, project and review management, and other interactions.
- `ASSETS/` contains the images and video used by the site.
- `.github/workflows/deploy-pages.yml` publishes the site to GitHub Pages.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. In the GitHub repository, open **Settings > Pages**.
3. Set **Build and deployment** source to **GitHub Actions**.
4. Push a commit to `main` or `master`, or start the **Deploy portfolio to GitHub Pages** workflow from the **Actions** tab.
5. After the workflow succeeds, find the live URL under **Settings > Pages** or in the workflow deployment summary.

## Preview locally

Open `index.html` directly, or use a local static-server extension such as Live Server in VS Code.

## Static portfolio

This site is static and has no backend, database, account login, or admin dashboard. Projects and client reviews are defined in `brandedge.js`; edit that file and redeploy to change them. The contact links open WhatsApp or the visitor's email app directly.

Removing the website connection does not delete or change any separate Supabase project or its stored data.
