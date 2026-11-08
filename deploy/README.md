# Deploying GymBuddy

One Docker Compose stack: `caddy` (web files + `/api` proxy), `api` (Spring Boot), `db` (PostgreSQL 17),
`backup` (nightly `pg_dump`) and, on the Synology, `cloudflared` (public HTTPS without opening router ports).
Only Caddy talks to the outside; the API and database are internal.

## Images

Every push to `main` runs `.github/workflows/build.yml`: backend tests, frontend typecheck/tests/build, then it pushes
`ghcr.io/arieveek/gymbuddy-api` and `ghcr.io/arieveek/gymbuddy-web` (tags `latest` and the commit SHA).
The packages start private on GitHub; either make them public or run `docker login ghcr.io` on the server
with a personal access token that has `read:packages`.

## Synology (now)

1. In the Cloudflare Zero Trust dashboard, create a tunnel and give it a public hostname
   (for example `gymbuddy.example.nl`) that points to `http://caddy:80`. Copy the tunnel token.
2. On the NAS, create a folder (for example `/volume1/docker/gymbuddy`) and copy into it
   `docker-compose.yml`, `backup.sh` and `.env.example` (renamed to `.env`).
3. Fill in `.env`: `POSTGRES_PASSWORD`, `GYMBUDDY_JWT_SECRET` (`openssl rand -base64 48`),
   `GYMBUDDY_WEB_ORIGIN=https://gymbuddy.example.nl`, `TUNNEL_TOKEN`, and your admin login
   `GYMBUDDY_ADMIN_EMAIL` / `GYMBUDDY_ADMIN_PASSWORD`.
4. Start it over SSH: `docker compose --profile synology up -d`
   (or create a Project in Container Manager from this folder and enable the `synology` profile).
   `docker compose logs api | grep -i admin` should say "Created admin account".
5. Point Hyper Backup at the `backups/` folder so the nightly dumps leave the NAS.

## Approving accounts

GymBuddy is invite-only. Someone taps "Request an account" in the app; the account waits until you approve it.
Log in with the admin email, open Profile → **Manage accounts** (or go to `/admin`), and approve, reject, block
or delete. Blocking logs that person out on every device at once. There is no email notification yet, so tell
people to let you know when they have signed up.

The admin password from `.env` is only used to create the account. There is no password reset yet: to reset the admin,
delete that row in the database (`docker compose exec db psql -U gymbuddy -c "delete from users where email='you@example.com'"`)
and restart the `api` service; it is created again from `.env`. This also deletes any athletes on the admin account,
so keep your own family's training on a separate, ordinary account.

Update to a new release: `docker compose pull && docker compose --profile synology up -d`.
Roll back: set `IMAGE_TAG` in `.env` to an earlier commit SHA and run the same command.

## VPS at hosting.nl (later)

Same files. In `.env` set `SITE_ADDRESS=gymbuddy.example.nl`, `HTTP_PORT=80`, `HTTPS_PORT=443`, leave `TUNNEL_TOKEN`
empty, point the domain's DNS at the VPS, open ports 80 and 443, and run `docker compose up -d` (without the profile).
Caddy gets the HTTPS certificate itself. Keep the OS patched.

## Restore a backup

```sh
gunzip -c backups/gymbuddy-YYYYMMDD-HHMM.sql.gz | docker compose exec -T db psql -U gymbuddy -d gymbuddy
```

Restore into an empty database (a fresh `db_data` volume) so existing rows don't collide.

## iOS app (on a Mac)

```sh
cd frontend
npm ci
NUXT_PUBLIC_API_BASE=https://gymbuddy.example.nl/api npm run generate   # the app calls the API by full URL
npx cap add ios        # first time only; creates frontend/ios/ (commit it)
npx cap sync ios
npx cap open ios       # in Xcode: set the team, then Product → Archive → upload to TestFlight
```

In Xcode, add `nl` and `en` under Project → Info → Localizations so iOS lists both languages.
Keep Awake and Haptics are already wired in the app; local workout reminders are not built yet.
