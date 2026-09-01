# link-shortener

a minimal link shortener. looks nice, mostly works, ticks boxes.

demo available at https://wack.club and https://hackthis.club for teens in Hack Club.

<img width="1920" height="1279" alt="screenshot of the link shortener homepage" src="https://github.com/user-attachments/assets/103dfa75-932b-4245-9c41-f68b53783b57" />

## features
- shorten links _(who knew?)_
- edit existing links
- **🌟 dynamic links** - add custom parameters (like /users/:id) and use them to redirect
- search and sort links
- track link clicks
- add expiration dates and urls, password protection, and link cloaking (à la [Dub](https://dub.co/help/article/link-cloaking))

## getting started

first, go to [Hack Club Auth](https://auth.hackclub.com/developer/apps) and create a new app with all scopes (openid, name, email, profile, verification_status, slack_id). add `http://localhost:3000/app/auth/callback` as a redirect url.

> if you can't see the Developer section, go to My Info and check the 'developer mode' box.

create `.env.local` and add the following variables:

```env
DATABASE_URL="file:./dev.db"

SESSION_SECRET="<randomly generated password>"

HACKCLUB_CLIENT_ID="<your client id>"
HACKCLUB_CLIENT_SECRET="<your client secret>"
```

then, to start the application, run:

```bash
pnpm install
pnpm db:push
pnpm dev
```

next, you'll probably want to run `pnpm db:studio`, open Drizzle Studio ([local.drizzle.studio](https://local.drizzle.studio)) in your browser, then add a domain called 'localhost'. do this after signing in for the first time, so you know your user id.

# build for production

to build this application for production:

```bash
pnpm build
```

you can then test locally with `pnpm preview` or deploy somewhere like Vercel! when deploying, you'll need to add domains manually.

> [!TIP]
> for a cloud sqlite database, I recommend [Turso](https://turso.tech/) since it's really easy (and free!) to get started.
> 
> you can also rewrite the database schema into Postgres or MySQL if you wish. check `src/db/schema.ts` and the Drizzle ORM docs for help.

## made with
- TanStack Start
- React + Tailwind CSS
- Drizzle ORM

some code for the link cloaking feature, like fetching meta tags, was adapted from [Dub](https://github.com/dubinc/dub) (license AGPLv3). if you need a free link shortener, don't have your own custom domain, or want more features, Dub is pretty good for most people!
