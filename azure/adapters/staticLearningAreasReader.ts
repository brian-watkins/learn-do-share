import { LearningArea as AreaToEngage } from "@/src/engage/learningArea.js";
import { LearningAreaReader } from "@/src/engage/learningAreaReader.js";
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory.js";
import { LearningArea } from "@/src/overview/learningAreas.js";
import { LearningAreasReader } from "@/src/overview/backstage.js";

function allLearningAreas(): Array<AreaToEngage> {
  return [
    {
      id: "area-1",
      title: "Test-Driven Development",
      content: "# Some stuff about TDD\n\nHere is some great stuff about test-driven development that you should learn and memorize immediately!\n\n### Further Reading\n- One\n- With a [link](https://yahoo.com)\n- Three\n",
      category: LearningAreaCategory.Discipline
    },
    {
      id: "area-2",
      title: "Pair Programming Techniques",
      content: "Some stuff about Pair Programming",
      category: LearningAreaCategory.Discipline
    },
    {
      id: "area-3",
      title: "Mocking During Tests",
      content: "Stuff about mocking",
      category: LearningAreaCategory.Discipline
    },
    {
      id: "area-4",
      title: "Participate in a Retro",
      content: "Retros are fun!",
      category: LearningAreaCategory.Team
    },
    {
      id: "area-5",
      title: "Participate in IPM",
      content: "IPM's are kind of fun!",
      category: LearningAreaCategory.Team
    },
    {
      id: "area-6",
      title: "Explain Agile",
      content: "Agile is super cool.",
      category: LearningAreaCategory.Theory
    },
    {
      id: "area-7",
      title: "Explain XP",
      content: "XP is EXTREME!",
      category: LearningAreaCategory.Theory
    },
    {
      id: "area-8",
      title: "Explain TDD",
      content: "TDD is the best!",
      category: LearningAreaCategory.Theory
    }
  ]
}

export class StaticLearningAreaReader implements LearningAreaReader {
  async read(id: string): Promise<AreaToEngage | null> {
    return allLearningAreas().find((area) => area.id === id) ?? null
  }
}

export class StaticLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    return allLearningAreas().map(({ content, ...props }) => props as LearningArea)
  }
}