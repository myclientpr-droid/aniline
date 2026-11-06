# AniLine — Premium Cinematic Production Website

Rohingya-led videography, photography, and visual production company website.

## Stack

- Next.js (App Router, JavaScript only)
- React Server Components by default
- Tailwind CSS v4 (CSS-first config)
- MongoDB (content & inquiries)
- Cloudinary (media delivery)

## Local Development

1. Copy `.env.example` to `.env.local` and fill in credentials.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run format` — Prettier write

## Admin authentication

Set `AUTH_SECRET` to a random secret of at least 32 characters in `.env.local`.
No owner credentials belong in the environment. Open `/admin/signup` and create
an account: the first account created is stored in MongoDB with the owner role,
and every account created afterwards is a member. Visitors can also self-register
from the same page and will always receive the member role.

The owner owns every write in the panel: creating and editing content, uploads,
inquiries, settings, and member accounts. Members are read-only — they can open
the content lists (`/admin/projects`, `/admin/services`, `/admin/team`,
`/admin/clients`, `/admin/photos`) to review what is there, but every create,
edit and delete view redirects them back to the list, and the dashboard,
inquiries, settings and account pages are owner-only.

The owner can create and remove member accounts under **Admin → Settings**.
Visitors can also self-register from the admin sign-up page; signup always
assigns the member role and can never create or promote an owner. Member
passwords must be at least 12 characters.

## Design Tokens

| Token      | Value     |
| ---------- | --------- |
| Deep Navy  | `#00133E` |
| Orange     | `#FEA500` |
| Slate Grey | `#6B7280` |
| Light Grey | `#F3F4F6` |
| Dark Navy  | `#000D2B` |

## Rules

- **No TypeScript** — `.js` and `.jsx` only
- **No secrets in repo** — use `.env.local`
- **Server Components by default** — add `'use client'` only when needed
