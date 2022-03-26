import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./api/backstage/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./api/build/backstage/index.mjs",
    external: [
        "@azure/functions"
    ],
    logLevel: "info"
})
