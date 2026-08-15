#!/bin/sh
set -eu

lock_hash="$(sha256sum package-lock.json | awk '{print $1}')"
lock_hash_file="node_modules/.package-lock.sha256"

if [ ! -f "$lock_hash_file" ] || [ "$(cat "$lock_hash_file")" != "$lock_hash" ]; then
  npm ci
  printf '%s' "$lock_hash" > "$lock_hash_file"
fi

exec npm run start:dev
