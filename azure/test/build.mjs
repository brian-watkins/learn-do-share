import esbuild from "esbuild"

await esbuild.build({
    entryPoints: [
        "./azure/test/functions/backstage.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/backstage/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "node-fetch",
        "unified",
        "rehype-stringify",
        "remark-parse",
        "remark-rehype",
        "hast-util-select",
        "date-fns",
        "party-supplies",
        "display-party",
        "state-party"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./azure/test/functions/root.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    outfile: "./azure/api/build/root/index.mjs",
    external: [
        "@azure/functions",
        "@azure/cosmos",
        "node-fetch",
        "party-supplies",
        "display-party",
        "state-party"
    ],
    logLevel: "info"
})

await esbuild.build({
    entryPoints: [
        "./azure/test/functions/engage.ts"
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
        "party-supplies",
        "display-party",
        "state-party",
        "date-fns"
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