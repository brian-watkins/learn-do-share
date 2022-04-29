import { LearningArea, LearningAreaGroup } from "./learningAreas.js";
import { LearningAreasReader } from "./readLearningAreas.js";

export class StaticLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    return [
      {
        id: "area-1",
        title: "Test-Driven Development",
        content: "# Some stuff about TDD\n\nHere is some great stuff about test-driven development that you should learn and memorize immediately!\n\n### Further Reading\n- One\n- With a [link](https://yahoo.com)\n- Three\n",
        group: LearningAreaGroup.Discipline
      },
      {
        id: "area-2",
        title: "Pair Programming Techniques",
        content: "Some stuff about Pair Programming",
        group: LearningAreaGroup.Discipline
      },
      {
        id: "area-3",
        title: "Mocking During Tests",
        content: "Stuff about mocking",
        group: LearningAreaGroup.Discipline
      },
      {
        id: "area-4",
        title: "Participate in a Retro",
        content: "Retros are fun!",
        group: LearningAreaGroup.Team
      },
      {
        id: "area-5",
        title: "Participate in IPM",
        content: "IPM's are kind of fun!",
        group: LearningAreaGroup.Team
      },
      {
        id: "area-6",
        title: "Explain the Principles and Values Behind Agile",
        content: "Agile is super cool.",
        group: LearningAreaGroup.Theory
      },
      {
        id: "area-7",
        title: "Explain the Principles and Values Behind XP",
        content: "XP is EXTREME!",
        group: LearningAreaGroup.Theory
      },
      {
        id: "area-8",
        title: "Explain the Principles and Values Behind TDD",
        content: "TDD is the best!",
        group: LearningAreaGroup.Theory
      }
    ]
  }
}