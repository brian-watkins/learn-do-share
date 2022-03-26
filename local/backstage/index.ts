import { Adapters } from "../../src/backstage.js";
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader.js"
import { createServer } from "./app.js";


const port = process.env.PORT || 7778;

const adapters: Adapters = {
    learningAreasReader: new StaticLearningAreasReader()
}

const app = createServer(adapters)

app.listen(port, () => {
    console.log("Server listening on port", port)
})