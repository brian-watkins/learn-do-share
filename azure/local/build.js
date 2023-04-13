import esbuild from "esbuild"

// await esbuild.build({
//     entryPoints: [
//         "./azure/local/functions/backstage.ts"
//     ],
//     platform: "node",
//     format: "esm",
//     target: "node16",
//     bundle: true,
//     outfile: "./azure/api/build/backstage/index.mjs",
//     external: [
//         "@azure/functions",
//         "@azure/cosmos",
//         "unified",
//         "rehype-stringify",
//         "remark-parse",
//         "remark-rehype",
//         "hast-util-select",
//         "node-fetch",
//         "loop"
//     ],
//     logLevel: "info"
// })

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
    logLevel: "verbose"
})

await esbuild.build({
    entryPoints: [
        "./azure/local/functions/engage.ts",
        // "./src/engage/index.ts"
    ],
    platform: "node",
    format: "esm",
    target: "node16",
    bundle: true,
    splitting: true,
    // outfile: "./azure/api/build/engage/index.mjs",
    outdir: "./azure/api/build/engage",
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
        "/Users/bwatkins/workspace/learn-do-share/azure/build/display/backstage.js"
        // "./engagementPlans/view.js",
        // "./engagementNotes/view.js"
    ],
    logLevel: "info"
})

// await esbuild.build({
//     entryPoints: [
//         "./src/engage/engagementNotes/view.ts",
//     ],
//     platform: "node",
//     format: "esm",
//     target: "node16",
//     bundle: true,
//     outfile: "./azure/api/build/engage/engagementNotes/view.js",
//     external: [
//         "loop",
//         "date-fns"
//     ],
//     logLevel: "info"
// })

// await esbuild.build({
//     entryPoints: [
//         "./src/engage/engagementPlans/view.ts",
//     ],
//     platform: "node",
//     format: "esm",
//     target: "node16",
//     bundle: true,
//     outfile: "./azure/api/build/engage/engagementPlans/view.js",
//     external: [
//         "loop"
//     ],
//     logLevel: "info"
// })

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