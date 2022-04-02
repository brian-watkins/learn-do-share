import { LearningArea } from "./learningAreas.js";
import { LearningAreasReader } from "./requestLearningAreas.js";

export class StaticLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    return [
      {
        title: "Test-Driven Development",
        content: "# Some stuff about TDD\n\nHere is some great stuff about test-driven development that you should learn and memorize immediately!\n\n### Further Reading\n- One\n- With a [link](https://yahoo.com)\n- Three\n"
      },
      {
        title: "Pair Programming Techniques",
        content: "Some stuff about Pair Programming"
      },
      {
        title: "Mocking During Tests",
        content: "Stuff about mocking"
      },
      {
        title: "Participate in a Retro",
        content: "Retros are fun!"
      },
      {
        title: "Participate in IPM",
        content: "IPM's are kind of fun!"
      },
      {
        title: "Explain the Principles and Values Behind Agile",
        content: "Agile is super cool."
      },
      {
        title: "Explain the Principles and Values Behind XP",
        content: "XP is EXTREME!"
      },
      {
        title: "Explain the Principles and Values Behind TDD",
        content: "TDD is the best!"
      }
    ]
  }
}