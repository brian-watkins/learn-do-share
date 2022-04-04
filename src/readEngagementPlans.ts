import { EngagementPlan } from "./engagementPlans";

export interface EngagementPlanReader {
  read(): Promise<Array<EngagementPlan>>
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
