import { LearningArea } from "@/src/engage/learningArea.js"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory.js"

export class TestLearningArea implements LearningArea {
  title: string
  content: string
  id: string
  selected: boolean
  category: LearningAreaCategory

  constructor(public testId: number) {
    this.id = `learning-area-${testId}`
    this.title = `Learning Area ${testId}`
    this.content = `Here is some content for learning Area ${testId}!`
    this.selected = false
    this.category = LearningAreaCategory.Discipline
  }

  withTitle(title: string): TestLearningArea {
    this.title = title
    return this
  }

  withContent(content: string): TestLearningArea {
    this.content = content
    return this
  }

  withCategory(category: LearningAreaCategory): TestLearningArea {
    this.category = category
    return this
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}
