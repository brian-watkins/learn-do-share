data: node --loader @esbuild-kit/esm-loader --no-warnings ./azure/local/startTestDataServer.ts
# vite: npx vite --port 7778
server: node ./azure/local/localServer.js
azure: COSMOS_PORT=3021 VITE_PORT=7778 ./azure/local/start.sh