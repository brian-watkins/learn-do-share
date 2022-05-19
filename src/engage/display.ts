import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { engagementPlansView, PersonalizedLearningArea } from "./personalizedLearningArea"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"
import { learningAreaContentView } from "./learningAreaContent"

export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface UnknownArea {
  type: "unknown-area"
}

export interface Personalized {
  type: "personalized"
  learningArea: PersonalizedLearningArea
  user: User
}

export type Model
  = Informative
  | UnknownArea
  | Personalized

type EngageMessage
  = EngagementPlanPersisted
  | EngagementPlansDeleted

function update(model: Model, action: EngageMessage): void {
  switch (model.type) {
    case "personalized":
      switch (action.type) {
        case "engagementPlanPersisted": {
          model.learningArea.engagementLevels.push(action.plan.level)
          break
        }
        case "engagementPlansDeleted": {
          model.learningArea.engagementLevels = []
          break
        }
      }
  }
}

// View

function view(model: Model): Html.View {
  switch (model.type) {
    case "unknown-area":
      return Html.div([], [
        Html.text("UNKNOWN LEARNING AREA!! WHAT!?!?!")
      ])
    case "informative":
      return Html.article([], [
        learningAreasLink(),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        learningAreaContentView(model.learningArea),
      ])
    case "personalized":
      return Html.article([], [
        learningAreasLink(),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        engagementPlansView(model.learningArea),
        learningAreaContentView(model.learningArea),
      ])
  }
}

function learningAreasLink(): Html.View {
  return Html.button([
    Html.cssClassList([
      { "mt-8": true },
      { "mx-16": true },
      { "px-4": true },
      { "py-2": true },
      { "rounded": true },
      { "border-cyan-800": true },
      { "border-2": true },
      { "border-dotted": true },
      { "text-cyan-800": true },
      { "font-bold": true },
      { "block": true }
    ])
  ], [
    Html.a([ Html.href("/") ], [
      Html.text("All Learning Areas")
    ])
  ])
}

const display: DisplayConfig<Model, any> = {
  update,
  view
}

export default display