#!/bin/sh
# Runs Lighthouse CI inside the Playwright image (used by the `lighthouse` compose service).
set -e
npm i -g pnpm@10.34.9 --silent
pnpm install --frozen-lockfile
CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"
export CHROME_PATH
pnpm lhci
