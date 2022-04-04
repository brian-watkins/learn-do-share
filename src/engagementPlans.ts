export enum EngagementLevel {
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export interface EngagementPlan {
  learningArea: string
  level: EngagementLevel
}

export interface EngagementPlanSelected {
  type: "engagementPlanSelected"
  plan: EngagementPlan
}

export function engagementPlanSelected(areaId: string, level: EngagementLevel): EngagementPlanSelected {
  return {
    type: "engagementPlanSelected",
    plan: {
      learningArea: areaId,
      level
    }
  }
}
