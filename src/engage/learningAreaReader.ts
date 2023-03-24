import { LearningArea } from "./learningArea.js";

export interface LearningAreaReader {
  read(id: string): Promise<LearningArea | null>
}