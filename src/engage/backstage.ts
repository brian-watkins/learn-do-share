import { Backstage } from "@/api/backstage/backstage.js";
import { User } from "@/api/common/user.js";
import { DeleteEngagementPlans, engagementPlanPersisted, engagementPlansDeleted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";
import { Model } from "./display.js";
import { LearningAreaReader } from "./learningAreaReader"
import { BackstageRenderer, InitialStateResult, templateResult, redirectResult, RenderContext } from "@/api/common/render.js";
import { EngagementPlan } from "./engagementPlans.js";
import { markdownToHTML } from "../util/markdownParser.js";
import { contentTagStyles } from "./learningAreaContent.js";
import { EngagementNoteContents, EngagementNoteCreationRequested, engagementNotePersisted } from "./engagementNotes.js";
import { LearningArea } from "./learningArea.js";
import { EngagementNote } from "./personalizedLearningArea.js";

export interface EngagementPlanReader {
  read(user: User): Promise<Array<EngagementPlan>>
}

export interface EngagementNoteReader {
  read(user: User, learningArea: LearningArea): Promise<Array<EngagementNote>>
}

export interface EngagementNoteWriter {
  write(user: User, learningAreaId: string, content: EngagementNoteContents): Promise<EngagementNote>
}

export interface Adapters {
  learningAreaReader: LearningAreaReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
  engagementNoteReader: EngagementNoteReader
  engagementNoteWriter: EngagementNoteWriter
}

export type DataMessage = WriteEngagementPlan | DeleteEngagementPlans | EngagementNoteCreationRequested

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
    case "engagementNoteCreationRequested":
      const note = await adapters.engagementNoteWriter.write(user, message.learningAreaId, message.contents)
      return engagementNotePersisted(note)
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

  learningArea.content = markdownToHTML(learningArea.content, contentTagStyles())

  if (context.user === null) {
    return templateResult("engage.html", {
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

    const engagementNotes = await adapters.engagementNoteReader.read(context.user, learningArea)

    return templateResult("engage.html", {
      type: "personalized",
      learningArea: { ...learningArea, engagementLevels: levels, engagementNotes },
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