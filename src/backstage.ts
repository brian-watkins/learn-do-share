import { Backstage, BackstageContext } from "../api/backstage/backstage.js";
import { User } from "../api/common/user.js";
import { AppModel } from "./app.js";
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

const initialState = (adapters: Adapters) => async (context: BackstageContext<null>): Promise<AppModel> => {
  const learningAreas = await adapters.learningAreasReader.read()

  if (context.user === null) {
    return {
      state: { type: "informative" },
      learningAreas: learningAreas,
      selectedLearningArea: { type: "learning-area-not-selected" }
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state: AppModel = {
      state: { type: "personalized", user: context.user, engagementLevels: toEngagementPlanMap(plans) },
      learningAreas: learningAreas,
      selectedLearningArea: { type: "learning-area-not-selected" }
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

export function initBackstage(adapters: Adapters): Backstage<null, DataMessage, AppModel> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}