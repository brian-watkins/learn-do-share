import { LearningAreasReader, requestLearningAreas } from "./requestLearningAreas";

export interface Adapters {
  learningAreasReader: LearningAreasReader
}

export function registry(adapters: Adapters): { [key: string]: any } {
  return {
    "learningAreasRequested": requestLearningAreas(adapters.learningAreasReader)
  }
}