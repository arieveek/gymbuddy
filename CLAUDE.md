# GymBuddy

Pull-up training app for a young competition gymnast. One Nuxt codebase runs as the website and the iPhone/iPad app; a Spring Boot API stores progress behind a parent login.

**Read [docs/architecture.md](docs/architecture.md) before making structural changes.** It is the source of truth for the stack, API, data model, deployment and build order.

## Stack

- **Frontend** (`frontend/`): Nuxt (Vue 3, TypeScript) with `ssr: false`, built with `nuxi generate`; Nuxt UI, Pinia, Capacitor for the iOS app (`frontend/ios/`), `@vite-pwa/nuxt` for the web.
- **Backend** (`backend/`): Java 21, Spring Boot, self-issued JWTs (Spring `JwtEncoder` + OAuth2 Resource Server), Spring Data JPA, PostgreSQL, Flyway migrations in `db/migration/`.
- **Deploy** (`deploy/`): one Docker Compose stack — caddy, api, db, cloudflared, backup.

## Prototype

`docs/bar-strong.html` is the clickable single-file prototype ("Bar Strong"). It is the reference for screens, styling and training content, not code to copy as is.

- **Content to port into `frontend/data/`:** `EX` (exercises: name, pose, type `hold`/`reps`/`list`, cues, why, tempo), `LEVELS` (5 levels, each plan is `[exercise, sets, value, label?]`), `levelFromTest()` (≥8 pull-ups → 5, ≥4 → 4, ≥1 → 3, hold ≥5s → 2, else 1), and the `POSES` stick-figure SVGs.
- **Screens:** Today (scoreboard header, workout list, test nudge after 6 workouts at a level and 12+ days since the last test), workout player (warm-up, sets, hold countdowns, 60s rest with +15s/skip, beeps), Moves, Progress (stats, test stepper, chart, level ladder, history, athlete name and level), Tips.
- **Look:** colour tokens and dark mode in the `:root` block, Big Shoulders Display + Figtree fonts, 52–60px touch targets.
- **Differs from the architecture:** the prototype has no age group or language in the profile, ends at level 5 with a finite ladder, and uses fixed doses. Follow the Training model section of `docs/architecture.md` instead: steps within levels, open-ended level 5, streaks and milestones.
- **Do not carry over:** the `window.claude` cloud sync (`connectCloud`). Persistence is Pinia + local storage now and the Spring API later. Records in the prototype have no ids (`{d, l}` sessions, `{d, p, h}` tests); the app gives each one a client-made UUID.

## Conventions

- Training content (exercises, levels) lives in `frontend/data/` as TypeScript. Do not move it to the database.
- The app is bilingual, Dutch (`nl`) and English (`en`). UI text goes in `frontend/i18n/locales/{nl,en}.json` via `@nuxtjs/i18n`; never hard-code user-facing strings. Text in `frontend/data/` is `{ nl, en }` objects. Every change adds both languages. The backend returns error codes, not display text.
- Every athlete query is scoped to the signed-in user. Never load an athlete, session or test by id alone.
- Session and test POSTs carry a client-generated UUID; inserts must be idempotent so offline syncs never duplicate.
- Auth uses bearer tokens, not cookies (Capacitor runs from `capacitor://localhost`). Refresh tokens are stored hashed and rotate on every refresh.
- An athlete profile is name, age group (`child`/`adult`), level and language. Keep personal data to that: no birth date or photos.
- Exercise explanations are animated SVG key poses first (reference: `docs/exercise-animations.html`, to be ported, not copied as is), real filmed clips later (`frontend/public/media/exercises/`). Never AI-generated video or images for showing form.
- Training has no finish line: level 5 scales from the latest test, and there is always a next goal. Plan and progress rules are pure functions in `frontend/utils/` with unit tests.
- Secrets (JWT signing key, DB password) go in `deploy/.env` on the server, never in the repo; only `.env.example` is committed.
- Keep it simple: one repo, one Compose stack, no extra services without a reason.

## Before opening a PR

- Run the backend tests.
- Run `nuxi typecheck` and the frontend unit tests (Vitest) in `frontend/`.
