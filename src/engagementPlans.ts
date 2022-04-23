import { LearningArea } from "./learningAreas"

export enum EngagementLevel {
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export interface EngagementPlan {
  learningArea: string
  level: EngagementLevel
}

export function engagementPlan(learningArea: LearningArea, level: EngagementLevel): EngagementPlan {
  return {
    learningArea: learningArea.id,
    level
  }
}