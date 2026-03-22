# Git CMS

A free, git-based CMS for non-profit organizations. Content is stored as Markdown files in your GitHub repository and served via GitHub Pages — **zero hosting costs**.

## Features

- **SolidJS** frontend — fast, reactive, minimal
- **Markdown content** stored directly in `content/pages/`
- **Admin panel** at `/admin` — no server required, uses GitHub's API
- **GitHub Pages** hosting — completely free
- **One-click deploys** via GitHub Actions on every content save

---

## Getting Started

### 1. Fork this repository

Click **Fork** on GitHub, then enable GitHub Pages:

> Repository Settings → Pages → Source: **Deploy from a branch** → Branch: `gh-pages`

### 2. Enable GitHub Actions

> Repository Settings → Actions → General → Allow all actions

The first deploy triggers automatically when you push to `main`.

### 3. Create a Personal Access Token

Go to: [github.com/settings/tokens/new](https://github.com/settings/tokens/new?scopes=public_repo&description=Git+CMS+Admin)

- Select scope: `public_repo` (or `repo` for private repositories)
- Copy the token — you'll paste it into the admin panel

### 4. Access the admin panel

Navigate to `https://<your-username>.github.io/<repo-name>/admin`

Enter:
- Your GitHub username
- This repository's name
- Your Personal Access Token

### 5. Create your first page

Click **New Page**, write in Markdown, and hit **Save & Commit**. GitHub Actions will rebuild and deploy within ~2 minutes.

---

## Content Model

Pages are Markdown files in `content/pages/`. The filename becomes the URL slug:

| File | URL |
|------|-----|
| `content/pages/home.md` | `/` (the home page) |
| `content/pages/about.md` | `/page/about` |
| `content/pages/programs.md` | `/page/programs` |

The first `# Heading` in a file is used as the page title in navigation.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env.local

# Edit .env.local:
# VITE_REPO_OWNER=your-github-username
# VITE_REPO_NAME=your-repo-name

# Start dev server
npm run dev
```

Visit `http://localhost:5173` for the site and `http://localhost:5173/admin` for the admin panel.

---

## Custom Domain

1. Add a `CNAME` file to `public/` with your domain (e.g., `www.yourorg.org`)
2. In `.github/workflows/deploy.yml`, uncomment the `cname:` line and set your domain
3. Configure your DNS: add a CNAME record pointing to `<your-username>.github.io`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [SolidJS](https://solidjs.com) |
| Build | [Vite](https://vitejs.dev) |
| Routing | [@solidjs/router](https://github.com/solidjs/solid-router) |
| Editor | [CodeMirror 6](https://codemirror.net) |
| Markdown | [marked](https://marked.js.org) + [DOMPurify](https://github.com/cure53/DOMPurify) |
| Hosting | [GitHub Pages](https://pages.github.com) (free) |
| Deploy | [GitHub Actions](https://github.com/features/actions) (free) |
| Backend | [GitHub Contents API](https://docs.github.com/en/rest/repos/contents) (free) |

**Total hosting cost: $0/month.**
