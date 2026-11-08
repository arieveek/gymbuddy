-- GymBuddy schema. Exercises and levels are not stored here: they live in the frontend code.

create table users (
    id            uuid primary key,
    email         varchar(254) not null unique,
    password_hash varchar(100) not null,
    created_at    timestamptz  not null default now()
);

-- One row per signed-in device. Only a SHA-256 hash of the token is stored, so a database leak cannot be replayed.
create table refresh_tokens (
    id         uuid primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    token_hash varchar(64) not null unique,
    expires_at timestamptz not null,
    revoked_at timestamptz,
    created_at timestamptz not null default now()
);
create index refresh_tokens_user_idx on refresh_tokens (user_id);

-- The athlete profile. Ids are made on the device, so profiles created offline sync without duplicates.
create table athletes (
    id         uuid primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    name       varchar(30) not null,
    age_group  varchar(5)  not null check (age_group in ('child', 'adult')),
    level      integer     not null check (level between 1 and 5),
    language   varchar(2)  not null check (language in ('nl', 'en')),
    updated_at timestamptz not null
);
create index athletes_user_idx on athletes (user_id);

create table sessions (
    id                 uuid primary key,
    athlete_id         uuid        not null references athletes (id) on delete cascade,
    date               date        not null,
    level              integer     not null check (level between 1 and 5),
    step               integer     not null check (step >= 1),
    light_week         boolean     not null default false,
    reps_total         integer     not null default 0 check (reps_total >= 0),
    hold_seconds_total integer     not null default 0 check (hold_seconds_total >= 0),
    created_at         timestamptz not null default now()
);
create index sessions_athlete_idx on sessions (athlete_id, date);

create table tests (
    id           uuid primary key,
    athlete_id   uuid        not null references athletes (id) on delete cascade,
    date         date        not null,
    pullups      integer     not null check (pullups >= 0),
    hang_seconds integer     not null check (hang_seconds >= 0),
    created_at   timestamptz not null default now()
);
create index tests_athlete_idx on tests (athlete_id, date);
