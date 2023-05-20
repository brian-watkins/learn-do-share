data: node --loader @esbuild-kit/esm-loader --no-warnings ./azure/local/startTestDataServer.ts
vite: npx vite --port 7778
func: cd ./azure/api && func start --port 7072
azure: COSMOS_PORT=3021 VITE_PORT=7778 FUNC_PORT=7072 ./azure/local/start.sh