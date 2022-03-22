import { LearningArea } from "./learningAreas.js";
import { LearningAreasReader } from "./requestLearningAreas.js";

export class StaticLearningAreasReader implements LearningAreasReader {
    async read(): Promise<LearningArea[]> {
        return [{
            title: "Test-Driven Development"
        }]
    }
}