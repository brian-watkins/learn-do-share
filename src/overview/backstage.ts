import { BackstageRenderer, InitialStateResult, okResult, RenderContext } from "@/api/common/render.js";
import { AppModel } from "./app.js";
import { EngagementLevel, EngagementPlan } from "../engage/engagementPlans.js";
import { User } from "@/api/common/user.js";
import { LearningArea } from "./learningAreas.js";

export interface EngagementPlanReader {
  read(user: User): Promise<Array<EngagementPlan>>
}

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanReader: EngagementPlanReader
}

const initialState = (adapters: Adapters) => async (context: RenderContext<null>): Promise<InitialStateResult<AppModel>> => {
  const learningAreas = await adapters.learningAreasReader.read()

  if (context.user === null) {
    return okResult({
      state: { type: "informative" },
      learningAreas: learningAreas,
    })
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const state: AppModel = {
      state: { type: "personalized", user: context.user, engagementLevels: toEngagementPlanMap(plans) },
      learningAreas: learningAreas,
    }

    return okResult(state)
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

export function initRenderer(adapters: Adapters): BackstageRenderer<null, AppModel> {
  return {
    initialState: initialState(adapters)
  }
}