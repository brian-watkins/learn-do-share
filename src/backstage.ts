import { Backstage } from "../api/backstage/backstage.js";
import { LearningAreasReader, requestLearningAreas } from "./requestLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
}

export function createBackstage(adapters: Adapters): Backstage {
  return {
    messageRegistry:   {
      "learningAreasRequested": requestLearningAreas(adapters.learningAreasReader)
    }  
  }
}