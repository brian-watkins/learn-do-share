import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./api/backstage/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outdir: "./api/build/backstage",
    external: [
        "@azure/functions"
    ],
    logLevel: "info"
})
