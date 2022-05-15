import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaContentView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { engagementPlansView, PersonalizedLearningArea } from "./personalizedLearningArea"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"

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
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        learningAreaContentView(model.learningArea),
      ])
    case "personalized":
      return Html.article([], [
        Html.div([
          Html.cssClassList([
            { "flex": true },
            { "flex-col": true },
          ])
        ], [
          learningAreaCategoryView(model.learningArea),
          learningAreaTitleView(model.learningArea),
          engagementPlansView(model.learningArea),
        ]),
        Html.div([], [
          learningAreaContentView(model.learningArea),
        ])
      ])
  }
}

const display: DisplayConfig<Model, any> = {
  update,
  view
}

export default display