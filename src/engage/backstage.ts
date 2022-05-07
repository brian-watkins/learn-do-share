import { Backstage, BackstageContext } from "../../api/backstage/backstage.js";
import { User } from "../../api/common/user.js";
import { EngageContext } from "../../api/engage/render"
import { AppModel } from "../app.js";
import { EngagementLevel, EngagementPlan } from "../engagementPlans.js";
import { EngagementPlanReader } from "../readEngagementPlans.js";
import { engagementPlanPersisted, EngagementPlanWriter, WriteEngagementPlan } from "../writeEngagementPlans.js";
import { LearningAreaReader } from "./learningAreaReader"

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
const initialState = (adapters: Adapters) => async (context: BackstageContext<EngageContext>): Promise<AppModel> => {
  const learningArea = await adapters.learningAreaReader.read(context.attributes.learningAreaId)

  if (learningArea == null) {
    return {
      learningAreas: [],
      selectedLearningArea: { type: "learning-area-not-found" },
      state: { type: "informative" }
    }
  }

  if (context.user === null) {
    return {
      learningAreas: [],
      selectedLearningArea: { type: "learning-area-selected", learningArea },
      state: { type: "informative" }
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state: AppModel = {
      state: {
        type: "personalized",
        user: context.user,
        engagementLevels: toEngagementPlanMap(plans)
      },
      selectedLearningArea: { type: "learning-area-selected", learningArea },
      learningAreas: []
      // learningArea: toPersonalizedLearningAreas(plans)(learningArea),
      // user: context.user
    }

    return state
  }
}

function toEngagementPlanMap(plans: Array<EngagementPlan>): { [key:string]: Array<EngagementLevel> } {
  let map: { [key:string]: Array<EngagementLevel> } = {}

  for (const plan of plans) {
    let list = map[plan.learningArea]
    if (!list) {
      map[plan.learningArea] = [plan.level]
    } else {
      list.push(plan.level)
    }
  }

  return map
}

// function toPersonalizedLearningAreas(plans: Array<EngagementPlan>): (area: LearningArea) => PersonalizedLearningArea {
//   return (area) => {
//     return Object.assign(area, {
//       engagementLevels: plans.filter(plan => plan.learningArea === area.id).map(plan => plan.level as EngagementLevel)
//     })
//   }
// }

export function initBackstage(adapters: Adapters): Backstage<EngageContext, any, AppModel> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}