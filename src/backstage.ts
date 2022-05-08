import { Backstage, BackstageContext } from "../api/backstage/backstage.js";
import { AppModel } from "./app.js";
import { EngagementLevel, EngagementPlan } from "./engagementPlans.js";
import { EngagementPlanReader } from "./readEngagementPlans.js";
import { LearningAreasReader } from "./readLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanReader: EngagementPlanReader
}

const initialState = (adapters: Adapters) => async (context: BackstageContext<null>): Promise<AppModel> => {
  const learningAreas = await adapters.learningAreasReader.read()

  if (context.user === null) {
    return {
      state: { type: "informative" },
      learningAreas: learningAreas,
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state: AppModel = {
      state: { type: "personalized", user: context.user, engagementLevels: toEngagementPlanMap(plans) },
      learningAreas: learningAreas,
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

export function initBackstage(adapters: Adapters): Backstage<null, never, AppModel> {
  return {
    messageHandler: () => Promise.reject("unused"),
    initialState: initialState(adapters)
  }
}