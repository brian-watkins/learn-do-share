import { LearningArea } from "./learningAreas"

export enum EngagementLevel {
  None = "none",
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export interface EngagementPlan {
  userId: string
  learningArea: string
  level: EngagementLevel
}

export function engagementPlan(learningArea: LearningArea, level: EngagementLevel): EngagementPlan {
  return {
    userId: "somebody-cool",
    learningArea: learningArea.id,
    level
  }
}