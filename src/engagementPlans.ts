export interface EngagementPlanWriter {
  write(plan: EngagementPlan): Promise<EngagementPlan>
}

export interface EngagementPlanReader {
  read(): Promise<Array<EngagementPlan>>
}

export enum EngagementLevel {
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export interface EngagementPlan {
  learningArea: string
  level: EngagementLevel
}

export interface EngagementPlansLoaded {
  type: "engagementPlansLoaded"
  plans: Array<EngagementPlan>
}

export interface EngagementPlansLoading {
  type: "engagementPlansLoading"
}

export function engagementPlansLoading(): EngagementPlansLoading {
  return {
    type: "engagementPlansLoading"
  }
}

export type EngagementPlansContent = EngagementPlansLoading | EngagementPlansLoaded

export function engagementPlansLoaded(plans: Array<EngagementPlan>): EngagementPlansLoaded {
  return {
    type: "engagementPlansLoaded",
    plans
  }
}

export interface EngagementPlansRequested {
  type: "engagementPlansRequested"
}

export function engagementPlansRequested(): EngagementPlansRequested {
  return {
    type: "engagementPlansRequested"
  }
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

export interface EngagementPlanPersisted {
  type: "engagementPlanPersisted"
  plan: EngagementPlan
}

export function engagementPlanPersisted(plan: EngagementPlan): EngagementPlanPersisted {
  return {
    type: "engagementPlanPersisted",
    plan
  }
}
