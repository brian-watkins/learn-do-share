import { Backstage } from "../api/backstage/backstage.js";
import { AppState } from "./app.js";
import { EngagementLevel, EngagementPlan } from "./engagementPlans.js";
import { LearningArea } from "./learningAreas.js";
import { PersonalizedLearningArea } from "./personalizedLearningAreas.js";
import { EngagementPlanReader } from "./readEngagementPlans.js";
import { LearningAreasReader } from "./readLearningAreas.js";
import { toUser } from "./user.js";
import { DeleteEngagementPlans, engagementPlanPersisted, engagementPlansDeleted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = WriteEngagementPlan | DeleteEngagementPlans

const update = (adapters: Adapters) => async (message: DataMessage) => {
  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(message.plan)
      return engagementPlanPersisted(message.plan)
    case "deleteEngagementPlans":
      await adapters.engagementPlanWriter.deleteAll(message.learningArea)
      return engagementPlansDeleted(message.learningArea)
  }
}

const initialState = (adapters: Adapters) => async (userIdentifier: string | null): Promise<AppState> => {
  const learningAreas = await adapters.learningAreasReader.read()
  const plans = await adapters.engagementPlanReader.read()
  const user = toUser(userIdentifier)

  if (user === null) {
    return {
      type: "informative",
      learningAreas: learningAreas
    }
  } else {
    const state = {
      type: "personalized",
      learningAreas: learningAreas.map(toPersonalizedLearningAreas(plans)),
      user: user
    }

    return state as AppState
  }
}

function toPersonalizedLearningAreas(plans: Array<EngagementPlan>): (area: LearningArea) => PersonalizedLearningArea {
  return (area) => {
    return Object.assign(area, {
      engagementLevels: plans.filter(plan => plan.learningArea === area.id).map(plan => plan.level as EngagementLevel)
    })
  }
}

export function initBackstage(adapters: Adapters): Backstage<DataMessage, AppState> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}