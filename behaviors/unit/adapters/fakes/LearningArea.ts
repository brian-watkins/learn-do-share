import { LearningArea } from "@/src/engage/learningArea.js";

export function TestLearningArea(testId: number): LearningArea {
  return {
    id: `learning-area-${testId}`,
    title: `Learn About Things ${testId}`,
    content: `Some things about learning area ${testId}`,
    category: "My Category"
  }
}
