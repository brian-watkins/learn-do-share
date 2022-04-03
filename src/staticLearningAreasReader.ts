import { LearningArea } from "./learningAreas.js";
import { LearningAreasReader } from "./requestLearningAreas.js";

export class StaticLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    return [
      {
        id: "area-1",
        title: "Test-Driven Development",
        content: "# Some stuff about TDD\n\nHere is some great stuff about test-driven development that you should learn and memorize immediately!\n\n### Further Reading\n- One\n- With a [link](https://yahoo.com)\n- Three\n"
      },
      {
        id: "area-2",
        title: "Pair Programming Techniques",
        content: "Some stuff about Pair Programming"
      },
      {
        id: "area-3",
        title: "Mocking During Tests",
        content: "Stuff about mocking"
      },
      {
        id: "area-4",
        title: "Participate in a Retro",
        content: "Retros are fun!"
      },
      {
        id: "area-5",
        title: "Participate in IPM",
        content: "IPM's are kind of fun!"
      },
      {
        id: "area-6",
        title: "Explain the Principles and Values Behind Agile",
        content: "Agile is super cool."
      },
      {
        id: "area-7",
        title: "Explain the Principles and Values Behind XP",
        content: "XP is EXTREME!"
      },
      {
        id: "area-8",
        title: "Explain the Principles and Values Behind TDD",
        content: "TDD is the best!"
      }
    ]
  }
}