#!/bin/bash

node ./azure/test/build.mjs

echo

node --enable-source-maps \
  --loader esbuild-node-loader \
  --no-warnings \
  ./behaviors/runner.ts
