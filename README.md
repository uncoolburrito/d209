# Wasim

Private group chat for our apartment. Closed allowlist, Supabase backend,
Next.js + Tailwind frontend, deployed to Vercel as an installable PWA.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind v4
- **Backend**: Supabase (Postgres + Auth + Realtime + Storage)
- **Deploy**: Vercel (Hobby tier)

## Build status

| Feature                    | State |
| -------------------------- | ----- |
| Auth (signup/login/reset)  | Done  |
| Email allowlist enforced   | Done  |
| Realtime messaging         | TODO  |
| Presence + typing          | TODO  |
| Direct messages            | TODO  |
| File / image uploads       | TODO  |
| PWA (manifest + icons)     | TODO  |

## First-time setup

### 1. Create the Supabase project

1. Sign in at https://supabase.com and create a new project.
2. Save the database password (you'll need it for the CLI later).
3. Go to **Project Settings → API** and copy:
   - **Project URL** → goes into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Do not copy the `service_role` key into this repo** — it bypasses RLS
   and must never reach the browser.

### 2. Configure Supabase auth URLs

In the Supabase dashboard, go to **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (change to your Vercel URL once deployed)
- **Redirect URLs**: add both
  - `http://localhost:3000/**`
  - `https://your-app.vercel.app/**` (once you deploy)

These tell Supabase which URLs it's allowed to send users back to after
clicking links in verification / password-reset emails.

### 2b. Update the email templates (important!)

This app uses the server-side auth flow (`verifyOtp`), which needs the email
links to include `token_hash` and `type`. Supabase's default templates use the
older client-side format, so update them once:

Go to **Authentication → Email Templates** in the dashboard.

**"Confirm signup"** template — replace the link line with:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm your email
</a>
```

**"Reset password"** template — replace the link line with:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/update-password">
  Reset your password
</a>
```

(Leave the rest of each template alone — only the link URL changes.)

### 3. Apply the database migration

The schema lives in `supabase/migrations/` as version-controlled SQL.

**Easiest path** (one-time, no tools required):

1. Open the Supabase dashboard → **SQL Editor**.
2. Open `supabase/migrations/20260617050000_initial.sql` from this repo.
3. **Edit the seed block at the bottom**: uncomment it and replace the
   placeholder emails with your apartment's real emails.
4. Paste the full SQL into the editor and run it.

**Alternative** (recommended once you're rolling, makes future migrations one command):

```bash
brew install supabase/tap/supabase   # macOS
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                     # applies migrations
```

### 4. Set up env vars

```bash
cp .env.local.example .env.local
# edit .env.local and paste the two Supabase values
```

### 5. Install + run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you should be redirected to `/login`.

## Adding a new roommate

Open Supabase → SQL Editor and run:

```sql
insert into public.allowed_emails (email, note)
values ('new-roommate@example.com', 'their name');
```

Then have them sign up at `/signup`. The DB trigger blocks any email not on
the allowlist.

## Removing a roommate

```sql
-- Remove their access to sign up again
delete from public.allowed_emails where email = 'them@example.com';

-- Optional: also delete their existing account
-- (do this from Authentication → Users in the dashboard — that handles
-- cascade cleanup of profiles and any messages they sent)
```

## Project layout

```
app/
  (auth)/              auth pages (login, signup, reset, update, check-email)
    actions.ts         server actions for all auth forms
    layout.tsx         centered card layout shared by all auth pages
  auth/
    confirm/route.ts   email verification callback
    signout/route.ts   POST sign out
  layout.tsx           root layout
  page.tsx             home (requires auth)
lib/
  supabase/
    client.ts          browser Supabase client
    server.ts          server Supabase client (uses cookies)
    middleware.ts      session-refresh + route protection logic
middleware.ts          wires up the Supabase middleware
supabase/
  migrations/          version-controlled SQL schema
```

## Security model

- **RLS on every table**, deny-by-default. Anything that grants access is an
  explicit policy.
- **Allowlist enforcement** runs as a database trigger (`handle_new_user`),
  so even if a client bypasses the UI, the row insert is rolled back when
  the email isn't on `allowed_emails`.
- **The `service_role` key never leaves the Supabase dashboard.** Only the
  anon key is referenced in code, and it's `NEXT_PUBLIC_*` (safe to ship).
- **Email verification is required**; Supabase doesn't issue a session until
  the user clicks the verification link.

## Deploy

(Not done yet — handled in the next chunk.) High level:

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set the three env vars in Vercel project settings.
4. Update Supabase's Site URL and Redirect URLs to the new Vercel domain.
