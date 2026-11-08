-- "Keep me logged in": long-lived tokens slide on every app open; short ones end with the browser session.
-- Tokens issued before this migration were all long-lived.
alter table refresh_tokens add column remember boolean not null default true;
create index refresh_tokens_expires_idx on refresh_tokens (expires_at);
