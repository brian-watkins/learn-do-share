#!/usr/bin/env bash

node ./azure/local/build.js

export COSMOS_DB_ENDPOINT="https://localhost:${COSMOS_PORT}"
export COSMOS_DB_READ_WRITE_KEY="some-fake-key"

node ./azure/local/setupDatabase.js

npx swa start http://localhost:${VITE_PORT} \
  --swa-config-location "./azure" \
  --api-location "./azure/api" \
  --open