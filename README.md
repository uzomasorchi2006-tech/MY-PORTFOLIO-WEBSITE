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

Open `index.html` directly, or use a local static-server extension such as Live Server in VS Code. A local server is recommended for consistent browser storage behavior.

## Admin dashboard limitations

Project changes are shared through Supabase and update other open portfolio pages in real time. To enable them:

1. Create a Supabase project at [supabase.com](https://supabase.com/) and create an admin user under **Authentication > Users**. Disable public sign-ups in the Authentication settings.
2. Set the admin user's UUID in `adminUserId` in `supabase-config.js`. The setup script's admin-only policies must use this same UUID; run the full `supabase-setup.sql` script once in the Supabase **SQL Editor**.
3. In **Project Settings > API**, copy the Project URL and the `anon`/publishable key into `url` and `anonKey` in `supabase-config.js`. These values are public website configuration; never put a `service_role` or secret key in this file.
4. Commit and push the changes to deploy. Sign in to the dashboard with the admin user's email and password.

On the first successful admin sign-in in a browser, locally saved custom projects are imported into Supabase. This can recover a project that was previously added on your phone. After setup, newly added projects and their images are stored centrally and appear on other open devices without a redeploy. Project image uploads are limited to 10 MB.

Client reviews are still stored in each browser's local storage and do not synchronize yet. The Supabase client uses row-level security so only the configured admin user can modify shared projects or upload images.
