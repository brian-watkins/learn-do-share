import { BackstageRenderer, InitialStateResult, templateResult, RenderContext } from "@/api/common/render.js";
import { AppModel } from "./app.js";
import { User } from "@/api/common/user.js";
import { LearningArea } from "./learningAreas.js";
import { EngagementLevel, EngagementPlan } from "../engage/engagementPlans/index.js";

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

export interface EngagementNoteReader {
  countByLearningArea(user: User): Promise<Array<NoteCount>>
}

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanReader: EngagementPlanReader
  engagementNoteReader: EngagementNoteReader
}

const initialState = (adapters: Adapters) => async (context: RenderContext<null>): Promise<InitialStateResult<AppModel>> => {
  const learningAreas = await adapters.learningAreasReader.read()

  if (context.user === null) {
    return templateResult("index.html", {
      state: { type: "informative" },
      learningAreas: learningAreas,
    })
  } else {
    const plans = await adapters.engagementPlanReader.readAll(context.user)
    const noteCounts = await adapters.engagementNoteReader.countByLearningArea(context.user)
    const state: AppModel = {
      state: {
        type: "personalized",
        user: context.user,
        engagementLevels: toEngagementPlanMap(plans),
        engagementNoteCounts: toEngagementNoteCountMap(noteCounts)
      },
      learningAreas: learningAreas,
    }

    return templateResult("index.html", state)
  }
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