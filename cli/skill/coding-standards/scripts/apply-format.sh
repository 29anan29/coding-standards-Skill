#!/usr/bin/env sh
# apply-format.sh — run the idiomatic formatter for the given files/dirs.
#
# Usage:
#   sh apply-format.sh <path> [<path> ...]
#
# Picks a formatter per file extension. Go is formatted by gofmt, Rust by
# rustfmt, C/C++ by clang-format. Files without a matching formatter are
# skipped with a note.
set -eu

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <path> [<path> ...]" >&2
  exit 2
fi

missing() {
  echo "WARNING: '$1' not found on PATH; skipping matching files" >&2
}

has() { command -v "$1" >/dev/null 2>&1; }

for src in "$@"; do
  if [ -d "$src" ]; then
    find "$src" \( -name '*.c' -o -name '*.h' -o -name '*.cpp' -o -name '*.hpp' \) -print0 \
      | xargs -0 -r -n1 clang-format -i 2>'/dev/null' || missing clang-format
    find "$src" -name '*.go' -print0 | xargs -0 -r -n1 gofmt -w 2>'/dev/null' || missing gofmt
    find "$src" -name '*.rs' -print0 | xargs -0 -r -n1 rustfmt --edition 2021 2>'/dev/null' || missing rustfmt
    continue
  fi
  case "$src" in
    *.c|*.h|*.cpp|*.hpp) has clang-format && clang-format -i "$src" || missing clang-format ;;
    *.go)                has gofmt      && gofmt -w "$src"      || missing gofmt ;;
    *.rs)                has rustfmt    && rustfmt --edition 2021 "$src" 2>'/dev/null' || missing rustfmt ;;
    *)                   echo "skip (no formatter): $src" ;;
  esac
done