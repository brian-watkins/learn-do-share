import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { engagementPlansView, PersonalizedLearningArea } from "./personalizedLearningArea"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"
import { learningAreaContentView } from "./learningAreaContent"
import { linkStyles } from "../viewElements"

export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: PersonalizedLearningArea
  user: User
}

export type Model
  = Informative
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
  return Html.a([linkStyles(), Html.href("/")], [
    Html.text("All Learning Areas")
  ])
}

const display: DisplayConfig<Model, any> = {
  update,
  view
}

export default display