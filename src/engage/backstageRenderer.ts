import { BackstageRenderer, InitialStateResult, redirectResult, RenderContext, viewResult } from "@/api/common/render.js";
import { decorate, markdownToHTML, TagDecorator } from "../util/markdownParser.js";
import { EngagementNote } from "./engagementNotes/index.js";
import { Model } from "./model.js";
import { render } from "display-party";
import App from "./display.js"
import { init } from "./storage.js";
import { Adapters } from "./backstage.js";
import { Store } from "state-party";

export interface EngageContext {
  learningAreaId: string
}

function initialState(adapters: Adapters): (context: RenderContext<EngageContext>) => Promise<InitialStateResult<Model>> {
  return async (context) => {
    const learningArea = await adapters.learningAreaReader.read(context.attributes.learningAreaId)

    if (learningArea == null) {
      return redirectResult("/index.html")
    }

    learningArea.content = markdownToHTML(learningArea.content, contentTagStyles())

    let model: Model

    if (context.user === null) {
      model = {
        type: "informative",
        learningArea
      }
    } else {
      const plans = await adapters.engagementPlanReader.read(context.user, learningArea)
      const levels = plans
        .map(plan => plan.level)

      const engagementNoteData = await adapters.engagementNoteReader.read(context.user, learningArea)

      const notes = engagementNoteData
        .map(displayableNote)

      model = {
        type: "personalized",
        learningArea,
        engagementLevels: levels,
        engagementNotes: notes,
        user: context.user
      }
    }

    const store = new Store()
    init(store, model)
    return viewResult("engage.html", await render(store, App()), model)
  }
}

export function initRenderer(adapters: Adapters): BackstageRenderer<EngageContext, Model> {
  return {
    initialState: initialState(adapters)
  }
}

function displayableNote(noteData: EngagementNote): EngagementNote {
  return {
    ...noteData,
    content: markdownToHTML(noteData.content, noteContentTagStyles())
  }
}

export function contentTagStyles(): Array<TagDecorator> {
  return [
    decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
    decorate("h1", { classname: "font-bold text-2xl" }),
    decorate("h3", { classname: "font-bold" }),
    decorate("ul", { classname: "list-disc list-inside" }),
    decorate("p", { classname: "pb-4" })
  ]
}

export function noteContentTagStyles(): Array<TagDecorator> {
  return [
    decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
    decorate("h1", { classname: "font-bold text-2xl" }),
    decorate("h3", { classname: "font-bold" }),
    decorate("ul", { classname: "list-disc list-inside" }),
    decorate("p", { classname: "pb-4" })
  ]
}
