import { getBackstageResult } from "@/api/backstage/adapter";
import { receiveMessage } from "@/display/procedure";
import { engagementLevelsRetrieved, engagementLevelsSaving } from ".";
import { Error, Personalized } from "../display";
import { LearningArea } from "../learningArea";

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


export const deleteEngagementPlansProcedure =
  receiveMessage<DeleteEngagementPlans, Personalized | Error>("deleteEngagementPlans")
    .updateView((state) => {
      state.engagementLevels = engagementLevelsSaving(state.engagementLevels.levels)
    })
    .andThen((message) => getBackstageResult<string>(message))
    .updateView((state, result) => {
      result.when({
        ok: () => state.engagementLevels = engagementLevelsRetrieved([]),
        error: () => {
          state.engagementLevels = engagementLevelsRetrieved(state.engagementLevels.levels)
          state.type = "error"
        }
      })
    })