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
        "unified",
        "rehype-stringify",
        "remark-parse",
        "remark-rehype",
        "hast-util-select"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./root/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./build/root/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./engage/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./build/engage/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "unified",
        "rehype-stringify",
        "remark-parse",
        "remark-rehype",
        "hast-util-select"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./login/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./build/login/index.mjs",
    external: [
        "@azure/functions"
    ],
    logLevel: "info"
})