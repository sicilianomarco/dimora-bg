#!/bin/sh
# Auto-commit and push whenever files change.
# Run once: ./watch-deploy.sh
# Stop with: Ctrl+C

REPO="$(cd "$(dirname "$0")" && pwd)"
GH_CONFIG_DIR="$HOME/Library/Application Support/gh"
export GH_CONFIG_DIR

echo "👁  Watching $REPO for changes (every 10s). Press Ctrl+C to stop."

while true; do
    cd "$REPO"
    if [ -n "$(git status --porcelain)" ]; then
        MSG="auto-deploy $(date '+%Y-%m-%d %H:%M')"
        git add .
        git commit -m "$MSG" --quiet
        git push --quiet && echo "✅ Pushed: $MSG" || echo "⚠️  Push failed — retrying next cycle"
    fi
    sleep 10
done
