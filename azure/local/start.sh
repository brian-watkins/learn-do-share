#!/usr/bin/env bash

node ./azure/local/build.js

npx swa start http://localhost:${VITE_PORT} \
  --swa-config-location "./azure" \
  --api-location "./azure/api" \
  --open