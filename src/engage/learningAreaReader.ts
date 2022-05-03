import { LearningArea } from "./learningArea";

export interface LearningAreaReader {
  read(id: string): Promise<LearningArea | null>
}