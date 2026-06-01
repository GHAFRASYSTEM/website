# GHAFRA Nord Website

Public website and content platform for GHAFRA Nord, the Ghanaian community association in Lille. The application serves the marketing site at `https://www.ghafra.com`, handles public forms through Formspree, and exposes Decap CMS with GitHub OAuth authentication for content editors.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Markdown and JSON content loaded from `content/`
- Decap CMS in `public/admin`
- Formspree for the contact and membership forms
- GitHub OAuth routes hosted on Vercel for CMS authentication

## Project Structure

- `src/app`: page routes, metadata routes, and API endpoints
- `src/app/api/cms/oauth/*`: GitHub OAuth authorize and callback handlers for Decap CMS
- `src/components`: page sections, forms, layout, and shared UI
- `src/lib/content.ts`: file-system content loader for markdown and JSON content
- `src/lib/cms-oauth.ts`: shared helpers for the CMS popup auth flow
- `content/`: editable page content, site settings, team members, and program entries
- `public/admin/config.yml`: Decap CMS backend and collection configuration
- `public/images`: uploaded and static images used by the site and CMS

## Requirements

- Node.js 20+
- npm

## Development

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
cp .env.example .env.local
```

3. Update the values in `.env.local` as needed.

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

The example values live in `.env.example`.

### Forms

- `NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID`: Formspree form ID used by the contact form
- `NEXT_PUBLIC_FORMSPREE_MEMBERSHIP_FORM_ID`: Formspree form ID used by the membership form

### CMS OAuth

- `CMS_GITHUB_CLIENT_ID`: GitHub OAuth App client ID
- `CMS_GITHUB_CLIENT_SECRET`: GitHub OAuth App client secret
- `CMS_OAUTH_CALLBACK_URL`: public callback URL for the OAuth App, currently `https://www.ghafra.com/api/cms/oauth/callback`
- `CMS_OAUTH_AUTHORIZE_URL`: documented public authorize URL for deployment consistency; the app serves the authorize route at `/api/cms/oauth/authorize`

## Content Management

Most site content is stored in the repository and loaded at build time or request time:

- `content/home.md`, `about.md`, `programs.md`, `get-involved.md`, `contact.md`: page content
- `content/programs-list/*.md`: program detail pages
- `content/team/*.md`: executive profiles
- `content/settings.json`: shared site settings such as canonical site URL, metadata, and social links

The CMS is available at `/admin` and is configured to use the GitHub backend for the `GHAFRASYSTEM/website` repository.

## Decap CMS and GitHub OAuth

Authentication is handled by GitHub OAuth through the Vercel-hosted routes in `src/app/api/cms/oauth/authorize/route.ts` and `src/app/api/cms/oauth/callback/route.ts`.

To configure CMS access:

1. Create a GitHub OAuth App.
2. Set the homepage URL to `https://www.ghafra.com`.
3. Set the authorization callback URL to `https://www.ghafra.com/api/cms/oauth/callback`.
4. Add `CMS_GITHUB_CLIENT_ID`, `CMS_GITHUB_CLIENT_SECRET`, and `CMS_OAUTH_CALLBACK_URL` in Vercel.
5. Redeploy the application.
6. Ensure every editor has write access to `GHAFRASYSTEM/website`.
7. If the repository is owned by a GitHub organization with OAuth restrictions, approve the OAuth App at the organization level.

After deployment, editors can log in at `https://www.ghafra.com/admin` with GitHub.

## Contributor Workflow

### Content Editors

Use the CMS when the change is content-only.

- Log in at `https://www.ghafra.com/admin`
- Edit page copy, program entries, executive profiles, and uploaded images
- Review the generated content carefully before saving
- Publish the change from the CMS so it commits back to `GHAFRASYSTEM/website`

Content editors should use the CMS for:

- text and markdown updates
- image replacements or additions
- social links and site-level metadata stored in `content/settings.json`
- team and program content updates

Content editors should not modify:

- `src/`
- `public/admin/config.yml`
- OAuth settings or other environment variables
- build, deployment, or Vercel configuration

### Developers

Use the local project when the change affects application behavior, styling, structure, or deployment.

1. Pull the latest changes from the repository.
2. Copy `.env.example` to `.env.local` if needed.
3. Run `npm install`.
4. Start the app with `npm run dev`.
5. Make code or configuration changes.
6. Run `npm run build` before merging or deploying.

Developers should use code changes for:

- React or Next.js page updates
- component or styling changes
- CMS schema or collection changes in `public/admin/config.yml`
- API route, OAuth, or form integration changes
- SEO, metadata, robots, or sitemap logic changes


## Local CMS Notes

`public/admin/config.yml` has `local_backend: true`, but this repository does not include a Decap proxy server script. The production editing path is the supported one: `/admin` on the deployed Vercel site with GitHub OAuth.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment

- Production site: `https://www.ghafra.com`
- Hosting: Vercel
- CMS backend: GitHub
- CMS admin: `https://www.ghafra.com/admin`

Before promoting a deployment, verify:

1. The Vercel environment variables are set.
2. `npm run build` succeeds.
3. `https://www.ghafra.com/admin` can complete the GitHub login flow.
4. A content change from the CMS creates a commit in `GHAFRASYSTEM/website`.
