cosmos: npx cosmosdb-server -p 3021
data: node --loader @esbuild-kit/esm-loader --no-warnings ./azure/local/startTestDataServer.ts
vite: npx vite --port 7778
azure: COSMOS_PORT=3021 VITE_PORT=7778 ./azure/local/start.sh