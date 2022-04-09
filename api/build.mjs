import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./backstage/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./build/backstage/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "applicationinsights"
    ],
    logLevel: "info"
})
