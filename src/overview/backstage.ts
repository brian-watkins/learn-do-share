import { BackstageRenderer, InitialStateResult, RenderContext, viewResult } from "@/api/common/render.js";
import app, { AppModel } from "./app.js";
import { User } from "@/api/common/user.js";
import { LearningArea } from "./learningAreas.js";
import { EngagementLevel, EngagementPlan } from "../engage/engagementPlans/index.js";
import { render } from "loop/display";

export interface EngagementPlanReader {
  readAll(user: User): Promise<Array<EngagementPlan>>
}

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export interface NoteCount {
  learningAreaId: string
  noteCount: number
}

export interface EngagementNoteCounter {
  countByLearningArea(user: User): Promise<Array<NoteCount>>
}

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanReader: EngagementPlanReader
  engagementNoteCounter: EngagementNoteCounter
}

const initialState = (adapters: Adapters) => async (context: RenderContext<null>): Promise<InitialStateResult<AppModel>> => {
  const learningAreas = await adapters.learningAreasReader.read()

  let model: AppModel

  if (context.user === null) {
    model = {
      state: { type: "informative" },
      learningAreas: learningAreas,
    }
  } else {
    const plans = await adapters.engagementPlanReader.readAll(context.user)
    const noteCounts = await adapters.engagementNoteCounter.countByLearningArea(context.user)
    model = {
      state: {
        type: "personalized",
        user: context.user,
        engagementLevels: toEngagementPlanMap(plans),
        engagementNoteCounts: toEngagementNoteCountMap(noteCounts)
      },
      learningAreas: learningAreas,
    }
  }

  return viewResult("index.html", await render(app(model)))
}

function toEngagementPlanMap(plans: Array<EngagementPlan>): { [key: string]: Array<EngagementLevel> } {
  let map: { [key: string]: Array<EngagementLevel> } = {}

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

function toEngagementNoteCountMap(counts: Array<NoteCount>): { [key: string]: number } {
  let map: { [key: string]: number } = {}

  for (const count of counts) {
    map[count.learningAreaId] = count.noteCount
  }

  return map
}


export function initRenderer(adapters: Adapters): BackstageRenderer<null, AppModel> {
  return {
    initialState: initialState(adapters)
  }
}