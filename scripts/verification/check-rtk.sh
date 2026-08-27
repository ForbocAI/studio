#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLASSIFIED_DIR="${STUDIO_CLASSIFIED_DIR:-$ROOT_DIR/../classified}"
CHECKER="$CLASSIFIED_DIR/scripts/check-rtk-conformance.sh"

if [ ! -f "$CHECKER" ]; then
    printf '[FAIL] Canonical classified RTK checker is unavailable: %s\n' "$CHECKER"
    exit 1
fi

bash "$CHECKER" "$ROOT_DIR"
