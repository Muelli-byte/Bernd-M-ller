#!/bin/bash
# Sets up the ai-video-agency toolchain for Claude Code on the web sessions.
# Idempotent and non-interactive; safe to re-run on every session start.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# ffmpeg (frame extraction + final video assembly)
if ! command -v ffmpeg >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y -qq ffmpeg
fi

# Higgsfield CLI (generation backend). The official install.sh pulls GitHub
# release binaries, which this sandbox's network policy blocks; the npm
# mirror (@higgsfield/cli, published from the same repo/tag) works instead.
if ! command -v higgsfield >/dev/null 2>&1; then
  npm install -g @higgsfield/cli
fi

# Official Higgsfield skills (higgsfield-generate, higgsfield-soul-id, ...)
SKILLS_CACHE="$HOME/.local/share/agent-skills-src/higgsfield-skills"
if [ ! -d "$SKILLS_CACHE" ]; then
  mkdir -p "$(dirname "$SKILLS_CACHE")"
  git clone --depth 1 https://github.com/higgsfield-ai/skills.git "$SKILLS_CACHE"
fi

mkdir -p "$HOME/.claude/skills"
for skill in higgsfield-generate higgsfield-soul-id higgsfield-product-photoshoot higgsfield-marketplace-cards higgsfield-websites; do
  ln -sfn "$SKILLS_CACHE/$skill" "$HOME/.claude/skills/$skill"
done

# This project's own ai-video-agency skill (vendored in-repo)
ln -sfn "$CLAUDE_PROJECT_DIR/ai-video-agency" "$HOME/.claude/skills/ai-video-agency"

echo "ai-video-agency toolchain ready: ffmpeg, higgsfield CLI, and 6 skills installed."
echo "Run 'higgsfield auth login' once to connect your Higgsfield account (interactive, do it yourself)."
