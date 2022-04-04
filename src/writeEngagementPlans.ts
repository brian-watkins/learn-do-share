import { BackstageMessage, backstageMessage } from "../display/backstage"
import { EngagementPlan } from "./engagementPlans"

export interface EngagementPlanWriter {
  write(plan: EngagementPlan): Promise<EngagementPlan>
}

export interface WriteEngagementPlan {
  type: "writeEngagementPlan"
  plan: EngagementPlan
}

export function writeEngagementPlan(plan: EngagementPlan): BackstageMessage<WriteEngagementPlan> {
  return backstageMessage({
    type: "writeEngagementPlan",
    plan
  })
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
