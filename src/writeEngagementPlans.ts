import { User } from "../api/common/user"
import { BackstageMessage, backstageMessage } from "../display/backstage"
import { EngagementPlan } from "./engagementPlans"
import { LearningArea } from "./learningAreas"

export interface EngagementPlanWriter {
  write(user: User, plan: EngagementPlan): Promise<EngagementPlan>
  deleteAll(user: User, learningArea: string): Promise<void>
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

export interface DeleteEngagementPlans {
  type: "deleteEngagementPlans"
  learningArea: string
}

export function deleteEngagementPlans<T extends LearningArea>(area: T): BackstageMessage<DeleteEngagementPlans> {
  return backstageMessage({
    type: "deleteEngagementPlans",
    learningArea: area.id
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

export interface EngagementPlansDeleted {
  type: "engagementPlansDeleted"
  learningArea: string
}

export function engagementPlansDeleted(learningArea: string): EngagementPlansDeleted {
  return {
    type: "engagementPlansDeleted",
    learningArea
  }
}