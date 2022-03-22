import { LearningAreasReader, requestLearningAreas } from "./requestLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
}

export function registry(adapters: Adapters): { [key: string]: any } {
  return {
    "learningAreasRequested": requestLearningAreas(adapters.learningAreasReader)
  }
}