import { Backstage, BackstageContext } from "../../api/backstage/backstage.js";
import { User } from "../../api/common/user.js";
import { EngageContext } from "../../api/engage/render"
import { EngagementLevel, EngagementPlan } from "../engagementPlans.js";
import { EngagementPlanReader } from "../readEngagementPlans.js";
import { engagementPlanPersisted, EngagementPlanWriter, WriteEngagementPlan } from "../writeEngagementPlans.js";
import { AppState } from "./display"
import { LearningArea } from "./learningArea.js";
import { LearningAreaReader } from "./learningAreaReader"
import { PersonalizedLearningArea } from "./personalizedLearningArea.js";

export interface Adapters {
  learningAreaReader: LearningAreaReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = WriteEngagementPlan //| DeleteEngagementPlans

const update = (adapters: Adapters) => async (user: User | null, message: DataMessage) => {
  if (user == null) {
    return { type: "no-user-found" }
  }

  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(user, message.plan)
      return engagementPlanPersisted(message.plan)
//     case "deleteEngagementPlans":
//       await adapters.engagementPlanWriter.deleteAll(user, message.learningArea)
//       return engagementPlansDeleted(message.learningArea)
  }
}

// Here I need to know a path variable basically ... the id of the learning area
const initialState = (adapters: Adapters) => async (context: BackstageContext<EngageContext>): Promise<AppState> => {
  const learningArea = await adapters.learningAreaReader.read(context.attributes.learningAreaId)

  if (learningArea == null) {
    return { type: "unknown-area" }
  }

  if (context.user === null) {
    return {
      type: "informative",
      learningArea: learningArea
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state = {
      type: "personalized",
      learningArea: toPersonalizedLearningAreas(plans)(learningArea),
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

export function initBackstage(adapters: Adapters): Backstage<EngageContext, any, AppState> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}