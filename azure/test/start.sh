#!/usr/bin/env bash

node ./azure/test/build.mjs

echo

node --enable-source-maps \
  --loader esbuild-node-loader \
  --no-warnings \
  ./behaviors/integration/runner.ts
