import { Adapters } from "../src/requests.js";
import { createServerApp } from "../src/server.js";
import { StaticLearningAreasReader } from "../src/staticLearningAreasReader.js"

console.log("PORT", process.env.PORT)

const port = process.env.PORT || 7778;

const adapters: Adapters = {
    learningAreasReader: new StaticLearningAreasReader()
}

const app = createServerApp(adapters)

app.listen(port, () => {
    console.log("Server listening on port", port)
})