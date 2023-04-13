#!/usr/bin/env bash

# npx vite build --outDir ./azure/build/display --ssr ./src/engage/backstage.ts 

node ./azure/local/build.js

npx swa start http://localhost:${VITE_PORT} \
  --swa-config-location "./azure" \
  --api-location "./azure/api" \
  --open