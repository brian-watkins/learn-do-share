#!/usr/bin/env bash

node ./azure/local/build.js

npx swa start http://localhost:${VITE_PORT} \
  --swa-config-location "./azure" \
  --api-devserver-url "http://127.0.0.1:${FUNC_PORT}" \
  --open