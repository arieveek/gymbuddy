-- Only accounts the admin approves can use the app. New registrations wait as 'pending'.
-- Accounts that existed before this migration were never vetted, so they start as pending too.
alter table users add column role varchar(10) not null default 'user' check (role in ('user', 'admin'));
alter table users add column status varchar(10) not null default 'pending' check (status in ('pending', 'approved', 'blocked'));
alter table users add column approved_at timestamptz;
create index users_status_idx on users (status);
