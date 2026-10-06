# Salman Rashid  -  Personal Research Website

A static, editorial-style academic website. Plain HTML, CSS, and a small
amount of vanilla JavaScript (mobile navigation only). No build step, no
framework, no paid services.

## Folder structure

```
.
├── index.html                              Home
├── research.html                           Research overview + interests
├── research-monetary-transmission.html     Project 1 (journal article)
├── research-diagnosing-inflation.html      Project 2 (EAG policy brief)
├── research-heterogeneous-transmission.html Project 3 (work in progress)
├── api/comment.js                           Moderated comment submission endpoint
├── eag.html                                 Economic Advisory Group role
├── about.html                               Background & positioning
├── cv.html                                  Full CV
├── notes.html                               Research notes / updates
├── contact.html                             Contact details
├── css/
│   └── style.css                            All site styling
├── js/
│   └── main.js                              Mobile navigation + comment submission
├── assets/
│   └── images/
│       ├── portrait.jpg
│       ├── project1-figure-irf.jpg
│       ├── project2-figure-policyrate.jpg
│       └── project2-figure-ratephase.jpg
└── README.md
```

All paths are relative, so the site works unmodified from any subpath or
custom domain.

## Editing content

There is no CMS or templating  -  each page is plain HTML. To edit text,
open the relevant `.html` file and edit directly. Shared structure (header
navigation, footer) is repeated at the top and bottom of every file; if you
change the navigation, update it consistently across all pages, or ask
an AI assistant to do a find-and-replace across the folder.

Common edits:
- **Change a research project's status** (e.g. once Project 2's brief is
  published): edit the `<span class="status-badge">` line and the "Current
  status" section near the bottom of the relevant `research-*.html` file.
- **Add a research interest note**: edit the relevant `<div class="interest-row">`
  block in `index.html` and `research.html`.
- **Add a notes entry**: add a new `<div class="timeline-item">` block in
  `notes.html` (and optionally `index.html`'s "Recent updates" section).
- **Add a footer link** (e.g. Google Scholar, ORCID): edit the `FOOTER`
  block if you regenerate via `build.py`, or edit the `<footer>` markup
  directly in each HTML file.

## Deploying to GitHub + Vercel

1. **Create a GitHub repository** and push this folder as its contents:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click "Add New… → Project" and import the repository.
   - Framework preset: choose **"Other"** (no build step is needed).
   - Leave the build command and output directory blank  -  Vercel will
     serve the static files as-is.
   - Click Deploy.

3. **Custom domain (optional):** in the Vercel project settings, go to
   "Domains" and add your domain, then follow Vercel's DNS instructions.

The main portfolio is static. The optional Comments & Feedback form uses Cloudflare Turnstile and Resend and requires the environment variables documented below.

## Notes on content accuracy

All research content on this site (statuses, figures, author lists,
affiliations) reflects the source documents provided at the time of
build. Two items are intentionally left as placeholders pending further
material:

- The research page currently presents three active projects; the former conflict-related household project has been removed for now.
- Project 2 remains a preliminary policy brief under review, and Project 3 remains an in-progress empirical study.


## Comments & Feedback

The homepage includes a minimal moderated comments form. Public visitors must provide a name, email, and comment; affiliation is optional. Cloudflare Turnstile and a honeypot are used for anti-spam protection.

Submissions are sent to the configured review address through the Resend API and are never published automatically. Set these Vercel environment variables before enabling the live form:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `COMMENTS_TO_EMAIL`
- `COMMENTS_FROM_EMAIL`

Replace `YOUR_TURNSTILE_SITE_KEY` in `index.html` with the public Turnstile site key. To approve a comment, review the email and then add the approved text manually to the public testimonials area when you are ready to publish it.
