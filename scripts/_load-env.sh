#!/bin/bash
# Helper: load secrets from scripts/.env.local (gitignored).
#
# Create scripts/.env.local from scripts/.env.local.example and fill in your values.
# Source this from deploy scripts, e.g.:
#   source "$(dirname "$0")/_load-env.sh"
#
# Exits with an error if .env.local is missing.
set -e
_LOAD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_LOAD_FILE="$_LOAD_DIR/.env.local"
if [ ! -f "$_LOAD_FILE" ]; then
  echo "ERROR: $_LOAD_FILE not found." >&2
  echo "Copy scripts/.env.local.example to scripts/.env.local and fill in your secrets." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$_LOAD_FILE"
