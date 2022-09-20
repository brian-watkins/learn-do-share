import { getBackstageResult } from "@/api/backstage/adapter";
import { User } from "@/api/common/user";
import { receiveMessage } from "@/display/procedure";
import { engagementLevelsRetrieved, engagementLevelsSaving, EngagementPlan } from ".";
import { Error, Personalized } from "../display";

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

export const saveEngagementPlan =
  receiveMessage<WriteEngagementPlan, Personalized | Error>("writeEngagementPlan")
    .updateView((state) => {
      state.engagementLevels = engagementLevelsSaving(state.engagementLevels.levels)
    })
    .andThen((message) => {
      return getBackstageResult<EngagementPlan>(message)
    })
    .updateView((state, result) => {
      result.when({
        ok: (value) => {
          const levels = state.engagementLevels.levels
          levels.push(value.level)
          state.engagementLevels = engagementLevelsRetrieved(levels)
        },
        error: () => {
          state.engagementLevels = engagementLevelsRetrieved(state.engagementLevels.levels)
          state.type = "error"    
        }
      })
    })