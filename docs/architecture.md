# GymBuddy: Architecture

8 Nov 2026 · Arie

## Overview

GymBuddy is a pull-up training app for a young competition gymnast: one Nuxt codebase runs as the website and the iPhone/iPad app, and a Spring Boot API stores progress behind a login.

- **What it does:** a level test places him on one of 5 levels; he follows a 15-minute workout 3 times a week; a retest every 2 weeks moves him up. Training never ends: the workout keeps growing with every test, also after the top level (see [Training model](#training-model)).
- **Profiles:** each athlete has a profile with first name, age group (child or adult), level and language. The app is built for a child but works for an adult too.
- **Platforms:** iPhone, iPad (native app via Capacitor) and any web browser.
- **Users:** one parent account per family; the child does not get his own login.
- **Languages:** Dutch and English, everywhere in the app including the training content.
- **Principles:** keep it simple, one repo, one Docker Compose stack, works offline at the gym and syncs when online.
- **Reference:** the clickable prototype [`docs/bar-strong.html`](bar-strong.html) shows the screens and the exercise content.

## Training model

Exercise is not finished when a level is reached, so the app has no finish line: levels 1–4 teach a strong pull-up, level 5 keeps growing with him, and there is always a next goal. All rules live in the frontend next to the training content.

### Profile

| Field | Values | Effect |
|---|---|---|
| Name | first name | Shown in the header |
| Age group | `child`, `adult` | Which Tips and safety text show, how the text is addressed, what level 5 may add (below) |
| Level | 1–5 | Which plan Today shows; set by tests, can be changed by hand |
| Language | `nl`, `en` | The language of the whole app for this athlete |

The profile is created on first start (name, age group, language) and the first test sets the level. It is edited on its own Profile screen, opened by tapping the name in the header.

| | Child | Adult |
|---|---|---|
| Text | Written for the parent and child together ("he", "your child") | Written to the user ("you") |
| Safety and Tips | Growing body: bodyweight only, stop on joint pain, check with the coach, hand care | Warm-up and shoulder health, recovery, hand care |
| Level 5 extras | More reps and harder variations (pause, L-sit) | The same, plus optional weighted pull-ups once 12 strict reps are reached |

### Levels and steps

- **Levels 1–4 are learning levels.** Each has a clear target that is also the entry test for the next level (as in the prototype).
- **Each level has steps.** The dose rises a little each week (one more rep, five more seconds, or an extra set) up to the level's cap. The step goes up after 3 workouts at that step and goes back to 1 when the level changes. Today shows "Level 3 · step 2".
- **Level 5 is open-ended.** Its dose is worked out from the latest test: main pull-up sets at about 60% of his best, holds and variations scaled the same way, harder variations unlocked at fixed thresholds. Every better test makes the workout harder, so there is no ceiling.
- **Lighter week:** every 6th week uses fewer sets with the same exercises, to recover. Today says so.
- **After a break:** no workout for 14+ days makes Today suggest a retest. Going down a level is allowed and is shown as normal, not as failing.

### Tests and goals

- A test every 2 weeks, for as long as he trains: max strict pull-ups and chin-over-bar hold.
- **There is always a next goal.** Levels 1–4: the next level's entry target. Level 5: a rolling personal best (best pull-ups + 1, best hold + 5 seconds).
- **Open-ended milestones**, worked out from sessions and tests, not stored:
  - pull-ups: 1, 5, 10, 15, 20, then every 5 more
  - workouts: 10, 25, 50, 100, then every 50 more
  - weekly streak (weeks with 3 workouts): 4, 8, 12, 26, 52, then every 26 more

### Progress screen

Ordered so that keeping going matters more than the level number:

1. **Consistency:** the current weekly streak and a grid of the last 12 weeks.
2. **Next goal and personal bests:** best pull-ups and hold, with an all-time chart of every test.
3. **Milestones:** the ones earned and the next one for each kind.
4. **Where he is:** level and step; level 5 reads "Competition · ongoing" with the current dose.
5. **History:** workouts and tests, newest first.

The prototype's ladder, which ends at level 5, is replaced by this.

## Architecture

One Nuxt build serves both clients; all traffic enters through the tunnel, Caddy splits web files from `/api`, and only the API touches the database.

```
iPhone/iPad app (Capacitor) ─┐
                             ├─> Cloudflare Tunnel ─> Caddy ─┬─> Nuxt static files
Web browser ─────────────────┘                               └─> /api ─> Spring Boot ─> PostgreSQL
```

## Frontend

Nuxt in single-page mode, built once as static files and shipped two ways: to the web server and inside a Capacitor iOS app.

| Concern | Choice | Notes |
|---|---|---|
| Framework | Nuxt (Vue 3, TypeScript) | `ssr: false`, built with `nuxi generate` |
| Native app | Capacitor (iOS) | One universal app for iPhone and iPad; built in Xcode on a Mac |
| UI | Nuxt UI (Tailwind) | Large touch targets, readable from the bar |
| State | Pinia | training store: athlete profile, sessions, tests |
| API client | `$api` plugin wrapping `$fetch` | Adds the bearer token, refreshes it on 401 |
| Token storage | Capacitor Preferences (app), localStorage (web) | Behind one small `useTokenStore` composable |
| Offline | Pinia persisted locally + an outbox queue | Workouts save offline, sync when back online |
| Native extras | Keep Awake, Haptics, Local Notifications | Screen stays on during holds; buzz at timer end; workout-day reminders |
| PWA (web) | `@vite-pwa/nuxt` | Add to home screen on the web version |
| Languages | `@nuxtjs/i18n` | Dutch (`nl`) and English (`en`); see [Languages](#languages) |

### Structure

- `pages/` — `index.vue` (Today), `workout.vue` (player), `moves.vue`, `progress.vue`, `profile.vue`, `tips.vue`, `login.vue`
- `data/` — `exercises.ts`, `levels.ts`, `milestones.ts`: the training content as plain TypeScript, edited in code, with Dutch and English text side by side
- `utils/` — `plan.ts` (today's workout from level, step, age group and latest test), `progress.ts` (streaks, personal bests, goals, milestones): pure functions with unit tests
- `i18n/locales/` — `nl.json`, `en.json`: UI text (buttons, labels, messages, Tips)
- `composables/` — `useTimer.ts` (hold and rest countdowns), `useApi.ts`
- `stores/` — `training.ts`, `auth.ts`

### Exercise media

Each exercise is explained with a short looping animation or clip, shown on the Moves screen and in the workout player. Getting the form right matters more than looks.

- **First: animated SVG.** Each exercise gets 2–4 key poses (for example dead hang → scap pull → back) that loop smoothly, drawn as SVG like the prototype's `POSES`. They are tiny, work offline, follow the colour tokens and dark mode, and show exactly the form described in the cues. They honour `prefers-reduced-motion` by showing the still key poses. The working preview with all 14 exercises, in both languages, is [`docs/exercise-animations.html`](exercise-animations.html); its pose data and small solver move to `frontend/data/poses.ts` and an `<ExerciseAnimation>` component in step 1.
- **Later, per exercise: real filmed clips.** 3–6 seconds, filmed from the side against a plain background, then muted, looped, H.264 MP4 at 720p (about 200–500 KB each) with a poster image. Played with `autoplay muted loop playsinline` so they work on iPhone. Film an adult or the coach, or film the child without his face, because the web version is public.
- **No AI-generated video for instruction.** Current video models get hands on the bar, elbow angles and body shape wrong. AI images or video may be used for decoration only (splash screen, App Store art).
- **Where they live:** files in `frontend/public/media/exercises/`, bundled in the app so they work offline at the gym. Each exercise in `data/exercises.ts` has `media: { poses, video?, poster? }`; a clip, when there is one, is used instead of the animation.
- **Review:** the coach checks every animation and clip before it ships.

### Languages

The app is fully bilingual, Dutch and English. Language is a frontend concern; the backend stores no text that needs translating.

- **Choosing the language:** language is part of the athlete profile and syncs with it. Before a profile exists (first start, login screen) the app follows the device or browser language (`nl` → Dutch, anything else → English), and a new profile starts with that language. Switching athletes switches the language.
- **UI text:** `@nuxtjs/i18n` with `nl.json` and `en.json`, using the no-prefix strategy (no `/nl/` in URLs, which suits the single-page app inside Capacitor). Components use `t('key')`; no hard-coded user-facing strings.
- **Training content:** each text field in `data/exercises.ts` and `data/levels.ts` holds both languages, for example `name: { nl: 'Dode hang', en: 'Dead hang' }`, typed so a missing translation fails `nuxi typecheck`. Exercise ids stay language-neutral (`hang`, `scap`), so stored sessions and tests do not depend on the language.
- **Dates and numbers:** formatted with `Intl` using the active locale (`8 nov.` vs `8 Nov`).
- **API errors:** the backend returns stable error codes (`EMAIL_TAKEN`, `INVALID_CREDENTIALS`, ...), which the frontend translates; it never sends display text.
- **iOS:** `Info.plist` lists `nl` and `en` in `CFBundleLocalizations`, and the permission texts (notifications) are localized, so iOS shows the app as Dutch and English.

## Backend

A single Spring Boot service owns authentication and progress data; it issues its own JWTs, so there is no external identity provider to run.

| Concern | Choice |
|---|---|
| Runtime | Java 21, current Spring Boot release |
| Starters | Web, Security, OAuth2 Resource Server, Data JPA, Validation, Actuator |
| Database access | Spring Data JPA + PostgreSQL driver |
| Migrations | Flyway (`db/migration/V1__init.sql`, ...) |
| Packaging | Docker image built with Buildpacks or a small Dockerfile |

### Authentication

1. Parent registers with email and password; password hashed with BCrypt.
2. Login returns a short-lived access token (JWT, ~15 minutes) and a refresh token (~30 days).
3. Access tokens are signed by Spring's `JwtEncoder` and validated by the resource server config.
4. Refresh tokens are random strings stored hashed in the database, so they can be revoked; each refresh rotates the token.
5. Bearer tokens, not cookies: the Capacitor app runs from `capacitor://localhost`, where cookies are unreliable.
6. CORS allows the web domain and `capacitor://localhost`.

### API

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create parent account |
| POST | `/api/auth/login` | Get access + refresh token |
| POST | `/api/auth/refresh` | Rotate tokens |
| POST | `/api/auth/logout` | Revoke refresh token |
| GET | `/api/athletes` | List athletes for this account |
| POST / PUT | `/api/athletes`, `/api/athletes/{id}` | Create or update the profile: name, age group, level, language |
| GET / POST | `/api/athletes/{id}/sessions` | Workout history / log a workout |
| GET / POST | `/api/athletes/{id}/tests` | Test results / record a test |

Every athlete endpoint checks that the athlete belongs to the signed-in user. Posts carry a client-generated id so an offline workout synced twice is stored once. Errors come back as a status plus a stable error code, never as display text, so the frontend can show them in Dutch or English.

### Data model

Five PostgreSQL tables, created by Flyway; exercises and levels are not stored here because they live in the frontend code.

| Table | Columns | Notes |
|---|---|---|
| `users` | id uuid, email unique, password_hash, created_at | The parent account |
| `refresh_tokens` | id, user_id → users, token_hash, expires_at, revoked_at | One row per signed-in device |
| `athletes` | id uuid, user_id → users, name, age_group (`child`/`adult`), level 1–5, language (`nl`/`en`), updated_at | The profile; a family can have more than one |
| `sessions` | id uuid (client-made), athlete_id → athletes, date, level, step, light_week, reps_total, hold_seconds_total, created_at | One completed workout; the totals keep history right when plans change |
| `tests` | id uuid (client-made), athlete_id → athletes, date, pullups, hang_seconds, created_at | One test result; the frontend derives the level from it |

Keep personal data minimal: a first name and an age group (child or adult), no birth date or photos.

## Hosting and deployment

Start on the Synology with a Cloudflare Tunnel; the same Docker Compose stack moves to a hosting.nl VPS unchanged if uptime starts to matter.

### Docker Compose services

| Service | Image | Role |
|---|---|---|
| caddy | caddy | Serves the Nuxt static files, proxies `/api` to the API |
| api | gymbuddy-api (built from `backend/`) | Spring Boot on port 8080, internal only |
| db | postgres | Data on a named volume, internal only |
| cloudflared | cloudflare/cloudflared | Synology only: public HTTPS without opening router ports |
| backup | small cron container | Nightly `pg_dump` to a backup folder |

### Where it runs

| Option | When | Notes |
|---|---|---|
| Synology (Container Manager) | Now | Free; depends on home internet and power; tunnel keeps ports closed |
| VPS at hosting.nl | When others use it or uptime matters | Caddy gets HTTPS certificates itself; you patch the OS |
| Azure | Not planned | Most managed but more cost and setup than needed |

### Releases

- **Backend and web:** GitHub Actions builds the API image and the Nuxt static files on each push to main; deploy by pulling the new image and running `docker compose up -d`.
- **iOS app:** `nuxi generate` → `npx cap sync ios` → archive in Xcode → TestFlight for the family. The App Store is optional.
- **Secrets:** JWT signing key and database password in a `.env` file on the server, never in the repo.
- **Backups:** Hyper Backup copies the nightly dumps off the NAS.

## Repository and build order

One GitHub repo, `gymbuddy`, connected to Claude Code; a root `CLAUDE.md` points Claude at this document.

```
gymbuddy/
  CLAUDE.md            architecture summary + conventions
  docs/architecture.md this document
  frontend/            Nuxt + Capacitor (ios/ folder lives here)
  backend/             Spring Boot (Maven or Gradle)
  deploy/
    docker-compose.yml
    Caddyfile
    .env.example
  .github/workflows/   build api image + web build
```

### Build order

1. Frontend only, data in local storage: profile, Today, workout player with timers, Moves, Progress with streaks and milestones, test flow — in Dutch and English from the start.
2. Backend: auth endpoints, athlete/session/test endpoints, Flyway schema, tests.
3. Connect them: login screen, `$api` plugin, offline outbox sync.
4. Docker Compose on the Synology with the Cloudflare Tunnel.
5. Capacitor iOS build, Keep Awake and Haptics, TestFlight on his iPhone and iPad.
