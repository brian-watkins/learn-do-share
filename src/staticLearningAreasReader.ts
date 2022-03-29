import { LearningArea } from "./learningAreas.js";
import { LearningAreasReader } from "./requestLearningAreas.js";

export class StaticLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    return [
      {
        title: "Test-Driven Development"
      },
      {
        title: "Pair Programming Techniques"
      },
      {
        title: "Mocking During Tests"
      },
      {
        title: "Participate in a Retro"
      },
      {
        title: "Participate in IPM"
      },
      {
        title: "Explain the Principles and Values Behind Agile"
      },
      {
        title: "Explain the Principles and Values Behind XP"
      },
      {
        title: "Explain the Principles and Values Behind TDD"
      }
    ]
  }
}