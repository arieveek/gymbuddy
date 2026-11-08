-- Current injuries of an athlete, as a comma-separated list of body areas (e.g. 'wrist,knee').
-- The app leaves out exercises that load these areas.
alter table athletes add column injuries varchar(100) not null default '';
