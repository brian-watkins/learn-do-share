import { User } from "@/api/common/user.js";
import { EngagementPlan } from "./index.js";

export interface WriteEngagementPlan {
  type: "writeEngagementPlan"
  plan: EngagementPlan
}

export function writeEngagementPlan(plan: EngagementPlan): WriteEngagementPlan {
  return {
    type: "writeEngagementPlan",
    plan
  }
}

export interface EngagementPlanWriter {
  write(user: User, plan: EngagementPlan): Promise<EngagementPlan>
  deleteAll(user: User, learningArea: string): Promise<void>
}
