import { User } from "@/api/common/user"
import { LearningArea } from "../learningArea"
import { EngagementPlan } from "."


export interface EngagementPlanWriter {
  write(user: User, plan: EngagementPlan): Promise<EngagementPlan>
  deleteAll(user: User, learningArea: string): Promise<void>
}

export type EngagementPlanMessages
  = WriteEngagementPlan
  | EngagementPlanWriteInProgress
  | DeleteEngagementPlans
  | EngagementPlanPersisted
  | EngagementPlansDeleted
  | EngagementPlanWriteFailed

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

export interface EngagementPlanWriteInProgress {
  type: "engagementPlanWriteInProgress"
}

export function engagementPlanWriteInProgress(): EngagementPlanWriteInProgress {
  return {
    type: "engagementPlanWriteInProgress"
  }
}

export interface DeleteEngagementPlans {
  type: "deleteEngagementPlans"
  learningArea: string
}

export function deleteEngagementPlans<T extends LearningArea>(area: T): DeleteEngagementPlans {
  return {
    type: "deleteEngagementPlans",
    learningArea: area.id
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

export interface EngagementPlanWriteFailed {
  type: "engagementPlanWriteFailed"
  plan: EngagementPlan
}

export function engagementPlanWriteFailed(plan: EngagementPlan): EngagementPlanWriteFailed {
  return {
    type: "engagementPlanWriteFailed",
    plan
  }
}