import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./azure/local/functions/backstage.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/backstage/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "unified",
        "rehype-stringify",
        "remark-parse",
        "remark-rehype",
        "hast-util-select",
        "node-fetch",
        "date-fns",
        "loop"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./azure/local/functions/root.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/root/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "loop",
        "node-fetch"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./azure/local/functions/engage.ts",
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/engage/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "unified",
        "rehype-stringify",
        "remark-parse",
        "remark-rehype",
        "hast-util-select",
        "node-fetch",
        "loop",
        "date-fns",
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./azure/api/login/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/login/index.mjs",
    external: [
        "@azure/functions"
    ],
    logLevel: "info"
})