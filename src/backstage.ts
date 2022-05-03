import { Backstage, BackstageContext } from "../api/backstage/backstage.js";
import { User } from "../api/common/user.js";
import { AppState } from "./app.js";
import { EngagementLevel, EngagementPlan } from "./engagementPlans.js";
import { LearningArea } from "./learningAreas.js";
import { PersonalizedLearningArea } from "./personalizedLearningAreas.js";
import { EngagementPlanReader } from "./readEngagementPlans.js";
import { LearningAreasReader } from "./readLearningAreas.js";
import { DeleteEngagementPlans, engagementPlanPersisted, engagementPlansDeleted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = WriteEngagementPlan | DeleteEngagementPlans

const update = (adapters: Adapters) => async (user: User | null, message: DataMessage) => {
  if (user == null) {
    return { type: "no-user-found" }
  }

  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(user, message.plan)
      return engagementPlanPersisted(message.plan)
    case "deleteEngagementPlans":
      await adapters.engagementPlanWriter.deleteAll(user, message.learningArea)
      return engagementPlansDeleted(message.learningArea)
  }
}

const initialState = (adapters: Adapters) => async (context: BackstageContext<null>): Promise<AppState> => {
  const learningAreas = await adapters.learningAreasReader.read()

  if (context.user === null) {
    return {
      type: "informative",
      learningAreas: learningAreas
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state = {
      type: "personalized",
      learningAreas: learningAreas.map(toPersonalizedLearningAreas(plans)),
      user: context.user
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

export function initBackstage(adapters: Adapters): Backstage<null, DataMessage, AppState> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}