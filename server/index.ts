import { Adapters } from "../src/requests.js";
import { StaticLearningAreasReader } from "../src/staticLearningAreasReader.js"
import { createServer } from "./app.js";


console.log("PORT", process.env.PORT)

const port = process.env.PORT || 7778;

const adapters: Adapters = {
    learningAreasReader: new StaticLearningAreasReader()
}

const app = createServer(adapters)

app.listen(port, () => {
    console.log("Server listening on port", port)
})