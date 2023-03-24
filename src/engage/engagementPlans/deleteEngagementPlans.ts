import { LearningArea } from "../learningArea.js";

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
