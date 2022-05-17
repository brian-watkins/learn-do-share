import { Backstage } from "@/api/backstage/backstage.js";
import { User } from "@/api/common/user.js";
import { DeleteEngagementPlans, engagementPlanPersisted, engagementPlansDeleted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";
import { Model } from "./display.js";
import { LearningAreaReader } from "./learningAreaReader"
import { BackstageRenderer, InitialStateResult, okResult, redirectResult, RenderContext } from "@/api/common/render.js";
import { EngagementPlan } from "./engagementPlans.js";

export interface EngagementPlanReader {
  read(user: User): Promise<Array<EngagementPlan>>
}

export interface Adapters {
  learningAreaReader: LearningAreaReader
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

export interface EngageContext {
  learningAreaId: string
}

const initialState = (adapters: Adapters) => async (context: RenderContext<EngageContext>): Promise<InitialStateResult<Model>> => {
  const learningArea = await adapters.learningAreaReader.read(context.attributes.learningAreaId)

  if (learningArea == null) {
    return redirectResult("/index.html")
  }

  if (context.user === null) {
    return okResult({
      type: "informative",
      learningArea
    })
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const levels = plans
      .filter(plan => plan.learningArea === learningArea.id)
      .map(plan => {
        return plan.level
      })

    return okResult({
      type: "personalized",
      learningArea: { ...learningArea, engagementLevels: levels },
      user: context.user
    })
  }
}

export function initRenderer(adapters: Adapters): BackstageRenderer<EngageContext, Model> {
  return {
    initialState: initialState(adapters)
  }
}

export function initBackstage(adapters: Adapters): Backstage<any> {
  return {
    messageHandler: update(adapters)
  }
}