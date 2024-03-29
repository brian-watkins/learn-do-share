import { Backstage } from "@/api/backstage/adapter.js";
import { User } from "@/api/common/user.js";
import { Model } from "./display.js";
import { LearningAreaReader } from "./learningAreaReader"
import { BackstageRenderer, InitialStateResult, templateResult, redirectResult, RenderContext } from "@/api/common/render.js";
import { markdownToHTML } from "../util/markdownParser.js";
import { contentTagStyles } from "./learningAreaContent.js";
import { noteContentTagStyles } from "./engagementNotes/view.js";
import { LearningArea } from "./learningArea.js";
import { EngagementNote, EngagementNoteContents, engagementNotesRetrieved } from "./engagementNotes";
import { engagementLevelsRetrieved, EngagementPlan } from "./engagementPlans/index.js";
import { EngagementNoteDeleteRequested } from "./engagementNotes/deleteNote.js";
import { EngagementNoteCreationRequested } from "./engagementNotes/saveNote.js";
import { EngagementPlanWriter, WriteEngagementPlan } from "./engagementPlans/saveEngagementPlan.js";
import { DeleteEngagementPlans } from "./engagementPlans/deleteEngagementPlans.js";

export interface EngagementPlanReader {
  readAll(user: User): Promise<Array<EngagementPlan>>
  read(user: User, learningArea: LearningArea): Promise<Array<EngagementPlan>>
}

export interface EngagementNoteReader {
  read(user: User, learningArea: LearningArea): Promise<Array<EngagementNote>>
}

export interface EngagementNoteWriter {
  write(user: User, learningAreaId: string, content: EngagementNoteContents): Promise<EngagementNote>
  delete(user: User, note: EngagementNote): Promise<void>
}

export interface Adapters {
  learningAreaReader: LearningAreaReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
  engagementNoteReader: EngagementNoteReader
  engagementNoteWriter: EngagementNoteWriter
}

export type DataMessage
  = WriteEngagementPlan
  | DeleteEngagementPlans
  | EngagementNoteCreationRequested
  | EngagementNoteDeleteRequested

const update = (adapters: Adapters) => async (user: User | null, message: DataMessage) => {
  if (user == null) {
    return { type: "no-user-found" }
  }

  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(user, message.plan)
      return message.plan
    case "deleteEngagementPlans":
      await adapters.engagementPlanWriter.deleteAll(user, message.learningArea)
      return JSON.stringify(message.learningArea)
    case "engagementNoteCreationRequested":
      const note = await adapters.engagementNoteWriter.write(user, message.learningAreaId, message.contents)
      return displayableNote(note)
    case "engagementNoteDeleteRequested":
      await adapters.engagementNoteWriter.delete(user, message.note)
      return message.note
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
    const plans = await adapters.engagementPlanReader.read(context.user, learningArea)
    const levels = plans
      .map(plan => plan.level)

    const engagementNoteData = await adapters.engagementNoteReader.read(context.user, learningArea)

    const notes = engagementNoteData
      .map(displayableNote)

    return templateResult("engage.html", {
      type: "personalized",
      learningArea, 
      engagementLevels: engagementLevelsRetrieved(levels), 
      engagementNotes: engagementNotesRetrieved(notes),
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

function displayableNote(noteData: EngagementNote): EngagementNote {
  return {
    ...noteData,
    content: markdownToHTML(noteData.content, noteContentTagStyles())
  }
}