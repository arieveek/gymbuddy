# GymBuddy

Pull-up training app for a young competition gymnast. One Nuxt codebase runs as the website and the iPhone/iPad app; a Spring Boot API stores progress behind a parent login that the admin must approve.

**Read [docs/architecture.md](docs/architecture.md) before making structural changes.** It is the source of truth for the stack, API, data model, deployment and build order.

## Stack

- **Frontend** (`frontend/`): Nuxt 4 (Vue 3, TypeScript) with `ssr: false`, built with `nuxt generate`; sources in `frontend/app/`. Nuxt UI, Pinia (persisted to localStorage), `@nuxtjs/i18n`, Capacitor for the iOS app (`frontend/ios/`, created on a Mac), `@vite-pwa/nuxt` for the web.
- **Backend** (`backend/`): Java 21, Spring Boot 4.1 (Maven wrapper), self-issued HS256 JWTs (Spring `JwtEncoder` + OAuth2 Resource Server), Spring Data JPA, PostgreSQL 17, Flyway migrations in `src/main/resources/db/migration/`.
- **Deploy** (`deploy/`): one Docker Compose stack — caddy (web image with the static site), api, db, backup, cloudflared (Synology profile). See `deploy/README.md`.

## Where things live

- Training content: `frontend/app/data/` — the exercise library (`exercises.ts` merging one file per category in `library/`, with `sources.ts`; research and safety notes in `docs/exercise-library.md`), `levels.ts`, `milestones.ts`, `tips.ts`.
- Animated drawings: `frontend/app/data/poses.ts` (index) with the solver in `poses/engine.ts` and one drawing per exercise in `poses/*.ts`. Check them on the `/poses` page (no login needed; `?cat=core` etc.).
- Training rules: `frontend/app/utils/plan.ts` (today's workout, steps, light weeks) and `progress.ts` (levels from tests, streaks, goals, milestones, retest nudge). Pure functions, tested in `frontend/test/`.
- Local state and the sync outbox: `frontend/app/stores/training.ts`; sync: `composables/useSync.ts` + `utils/sync.ts`; auth: `stores/auth.ts`, `plugins/api.ts` (`$api`).
- UI text: `frontend/i18n/locales/{nl,en}.json`.

## Prototypes

`docs/bar-strong.html` (screens, look, original content) and `docs/exercise-animations.html` (animated poses) are references. Both are ported; change the app, not the prototypes. Where they differ from `docs/architecture.md` (finite ladder, fixed doses, no age group or language), the architecture wins.

## Conventions

- Training content (exercises, levels) lives in `frontend/app/data/` as TypeScript. Do not move it to the database.
- The app is bilingual, Dutch (`nl`) and English (`en`). UI text goes in the locale files via `@nuxtjs/i18n`; never hard-code user-facing strings. Text in `frontend/app/data/` is `{ nl, en }` objects. Every change adds both languages. The backend returns error codes, not display text.
- Login is required and the app is invite-only: accounts start `pending` and only `approved` ones get tokens or pass the API (checked on every request, so blocking is immediate). The admin is created from `GYMBUDDY_ADMIN_EMAIL`/`_PASSWORD` at startup, never by registering. Admin endpoints live under `/api/admin` (ROLE_ADMIN); the web page is `/admin`.
- After login the app works offline. Every local change goes through the training store so it is queued in the outbox. Logout clears the device's training data; a different account logging in starts clean.
- Every athlete query is scoped to the signed-in user. Never load an athlete, session or test by id alone.
- Athlete, session and test ids are client-made UUIDs; posts must stay idempotent so offline syncs never duplicate. Profiles merge last-write-wins on `updatedAt`.
- Auth uses bearer tokens, not cookies (Capacitor runs from `capacitor://localhost`). Refresh tokens are stored hashed and rotate on every refresh; reusing one revokes all of that account's tokens, so every refresh goes through `auth.refresh()` (shared request + cross-tab Web Lock).
- "Keep me logged in" (default on) = 30-day refresh token that slides: the app refreshes on every open (`auth.touch()`), restarting the 30 days. Without it: 12 hours max, kept in sessionStorage/memory only.
- An athlete profile is name, age group (`child`/`adult`), level, language and current injuries (body areas). Keep personal data to that: no birth date, photos or medical details beyond the injured areas.
- Device-only data: age band, growth-spurt mode, ticked KNGU goals, today's check-in and reminder settings live in `training.deviceOnly` (persisted locally) and must never be added to the synced `Athlete` or sent to the API. KNGU goals per age band are in `frontend/app/data/kngu.ts` (from the KNGU Technische Leerlijn Turnen Heren 2021).
- Every exercise lists the body areas it loads in `frontend/app/data/loads.ts` (a full Record, so new exercises must be added). With an injury, those exercises are left out of the workout (`buildWorkout`), listed on Today, and marked in the library; the test dialog warns when the test loads an injured area.
- Exercise explanations are animated SVG key poses (`poses.ts`), real filmed clips later (`frontend/public/media/exercises/`). Never AI-generated video or images for showing form.
- Every library exercise has a category, equipment, level, cues and safety in both languages, at least one source from `sources.ts` (or `commonPractice`), reciprocal `easier`/`harder` links and a drawing; `test/library.test.ts` enforces this. Keep the 15 ids the workout plan uses. Oversplits, walkovers at home, kettlebell swings, heavy or maximal lifts and similar are left out on purpose (see `docs/exercise-library.md`). Light dumbbell/kettlebell exercises are shown to children with the "light, 15 clean reps, supervised" note; weighted pull-ups stay adult-only.
- Training has no finish line: level 5 scales from the latest test, and there is always a next goal.
- Secrets (JWT signing key, DB password) go in `deploy/.env` on the server, never in the repo; only `.env.example` is committed.
- Keep it simple: one repo, one Compose stack, no extra services without a reason.

## Running locally

- API: `cd backend && ./mvnw spring-boot:test-run` starts it on 8080 with a throwaway PostgreSQL in Docker; log in as `admin@example.com` / `admin-password-for-tests` (from `src/test/resources/application.properties`) to approve test accounts.
- Web: `cd frontend && npm run dev` proxies `/api` to `http://localhost:8080` (set `API_TARGET` if that port is taken).

## Before opening a PR

- Run the backend tests: `cd backend && ./mvnw verify` (needs Docker for Testcontainers).
- Run `npm run typecheck` and `npm test` in `frontend/`.
