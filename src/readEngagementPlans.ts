import { EngagementPlan } from "./engagementPlans";

export interface EngagementPlanReader {
  read(): Promise<Array<EngagementPlan>>
}

export interface EngagementPlansLoaded {
  type: "engagementPlansLoaded"
  plans: Array<EngagementPlan>
}

export type EngagementPlansContent = EngagementPlansLoaded

export function engagementPlansLoaded(plans: Array<EngagementPlan>): EngagementPlansLoaded {
  return {
    type: "engagementPlansLoaded",
    plans
  }
}
