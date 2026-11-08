#!/bin/sh
# Nightly pg_dump into /backups (mounted from ./backups), keeping KEEP_DAYS days.
# Runs once at start, then every night at BACKUP_TIME (default 03:00, container time zone TZ).
set -eu

KEEP_DAYS="${KEEP_DAYS:-14}"
BACKUP_TIME="${BACKUP_TIME:-03:00}"

backup() {
	file="/backups/gymbuddy-$(date +%Y%m%d-%H%M).sql.gz"
	if pg_dump --no-owner --no-privileges | gzip > "$file.tmp"; then
		mv "$file.tmp" "$file"
		echo "backup: wrote $file"
	else
		rm -f "$file.tmp"
		echo "backup: pg_dump failed" >&2
	fi
	find /backups -name 'gymbuddy-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
}

until pg_isready -q; do sleep 2; done
backup

while true; do
	now=$(date +%s)
	next=$(date -d "$(date +%Y-%m-%d) $BACKUP_TIME" +%s)
	[ "$next" -le "$now" ] && next=$((next + 86400))
	sleep $((next - now))
	backup
done
