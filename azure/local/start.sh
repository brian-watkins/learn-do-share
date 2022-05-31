#!/usr/bin/env bash

node ./azure/local/build.mjs

export COSMOS_DB_ENDPOINT="https://localhost:${COSMOS_PORT}"
export COSMOS_DB_READ_WRITE_KEY="some-fake-key"

npx swa start http://localhost:${VITE_PORT} \
  --swa-config-location "./azure" \
  --api-location "./azure/api" \
  --open