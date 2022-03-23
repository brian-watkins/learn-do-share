import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./server/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outdir: "./build/server",
    external: [
        "express"
    ],
    logLevel: "info"
})
