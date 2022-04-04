export enum EngagementLevel {
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export interface EngagementPlan {
  learningArea: string
  level: EngagementLevel
}

export function engagementPlan(learningArea: string, level: EngagementLevel): EngagementPlan {
  return {
    learningArea,
    level
  }
}