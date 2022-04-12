import { LearningArea } from "./learningAreas";

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}