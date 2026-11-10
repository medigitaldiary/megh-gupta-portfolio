#!/usr/bin/env bash
# STYLE.md §1 CI guard: no em dashes in rendered copy or UI strings.
# Scope: MDX content, public static artifacts, and string / JSX text in
# source files. Code and JSX block comments are allowed; the guard
# ignores them to keep the signal clean.

set -u

STATUS=0
report=""

add() {
  local label="$1"
  local body="$2"
  if [ -n "$body" ]; then
    report+=$'\n'"— $label —"$'\n'"$body"$'\n'
    STATUS=1
  fi
}

# 1) Any em dash anywhere under content/ (MDX renders in full).
mdx=$(grep -rn --color=never "—" content 2>/dev/null || true)
add "content/**" "$mdx"

# 2) Any em dash inside the AI Call iframe and sibling static artifacts.
art=$(grep -rn --color=never "—" public/artifacts 2>/dev/null || true)
add "public/artifacts/**" "$art"

# 3) In TS/TSX/JS, em dashes inside string literals or between JSX text.
#    Pattern: "..." or '...' or `...` containing —, OR a line with —
#    that is not a //, /*, * block comment. Then strip the raw ones
#    that are clearly comments.
src=$(grep -rn --color=never --include="*.ts" --include="*.tsx" --include="*.js" \
  -E '([\"'"'"'`][^\"'"'"'`]*—[^\"'"'"'`]*[\"'"'"'`])' components app lib 2>/dev/null \
  | grep -v "biome-ignore" \
  | grep -Ev "^[^:]+:[0-9]+:\s*(//|\*)" || true)
add "components / app / lib (string literals)" "$src"

if [ "$STATUS" -ne 0 ]; then
  echo "Em dashes found (STYLE.md §1 forbids them in rendered copy and UI strings):"
  echo "$report"
  echo "Replace with a period, colon, comma, parentheses or 'to' per STYLE.md's table."
  echo "Code comments are allowed; they are excluded from this guard."
fi

exit "$STATUS"
