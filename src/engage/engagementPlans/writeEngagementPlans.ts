import { User } from "@/api/common/user"
import { handleBackstageMessage } from "@/display/backstage"
import { Subscription, subscribe } from "@/display/message"
import { LearningArea } from "../learningArea"
import { EngagementLevels, engagementLevelsRetrieved, engagementLevelsSaving, EngagementPlan } from "."


export interface PlansModel {
  learningArea: LearningArea
  engagementLevels: EngagementLevels
}

export const subscriptions: Array<Subscription<PlansModel, any>> = [
  subscribe("writeEngagementPlan", {
    do: handleBackstageMessage,
    update: (model) => {
      model.engagementLevels = engagementLevelsSaving(model.engagementLevels.levels)
    }
  }),
  subscribe("engagementPlanPersisted", {
    update: (model, action) => {
      const levels = model.engagementLevels.levels
      levels.push(action.plan.level)
      model.engagementLevels = engagementLevelsRetrieved(levels)
    }
  }),
  subscribe("deleteEngagementPlans", {
    do: handleBackstageMessage
  }),
  subscribe("engagementPlansDeleted", {
    update: (model) => {
      model.engagementLevels = engagementLevelsRetrieved([])
    }
  })
]

export interface EngagementPlanWriter {
  write(user: User, plan: EngagementPlan): Promise<EngagementPlan>
  deleteAll(user: User, learningArea: string): Promise<void>
}

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