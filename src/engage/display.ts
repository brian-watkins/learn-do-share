import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { engagementLevelsRetrieved, engagementLevelsSaving, engagementPlansView, PersonalizedLearningArea } from "./personalizedLearningArea"
import { EngagementPlanPersisted, EngagementPlansDeleted, WriteEngagementPlan } from "./writeEngagementPlans"
import { learningAreaContentView } from "./learningAreaContent"
import { header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { EngagementNotePersisted, engagementNotesView } from "./engagementNotes"

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
  = WriteEngagementPlan
  | EngagementPlanPersisted
  | EngagementPlansDeleted
  | EngagementNotePersisted

function update(model: Model, action: EngageMessage): void {
  switch (model.type) {
    case "personalized":
      switch (action.type) {
        case "writeEngagementPlan": {
          model.learningArea.engagementLevels = engagementLevelsSaving(model.learningArea.engagementLevels.levels)
          break
        }
        case "engagementPlanPersisted": {
          const levels = model.learningArea.engagementLevels.levels
          levels.push(action.plan.level)
          model.learningArea.engagementLevels = engagementLevelsRetrieved(levels)
          break
        }
        case "engagementPlansDeleted": {
          model.learningArea.engagementLevels = engagementLevelsRetrieved([])
          break
        }
        case "engagementNotePersisted": {
          model.learningArea.engagementNotes.unshift(action.note)
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
        pageHeader([
          learningAreasLink(),
          loginView(model.learningArea)
        ]),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        learningAreaContentView(model.learningArea),
      ])
    case "personalized":
      return Html.article([], [
        pageHeader([
          learningAreasLink(),
          userAccountView(model.user)
        ]),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        contentArea([
          learningAreaContentView(model.learningArea),
          contentColumn([
            engagementPlansView(model.learningArea),
            engagementNotesView(model.learningArea)
          ])
        ])
      ])
  }
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([], views)
}

function contentArea(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-32"
    ])
  ], views)
}

function contentColumn(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "mt-12",
      "flex",
      "flex-col",
      "gap-4"
    ])
  ], views)
}

export function loginView(area: LearningArea): Html.View {
  return linkBox(`/login?redirect=/learning-areas/${area.id}`, "Login")
}

function learningAreasLink(): Html.View {
  return linkBox("/", "All Learning Areas")
}

const display: DisplayConfig<Model, any> = {
  update,
  view
}

export default display