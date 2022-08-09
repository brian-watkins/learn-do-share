import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { learningAreaContentView } from "./learningAreaContent"
import { header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { view as engagementNotesView } from "./engagementNotes/view"
import { subscriptions as engagementNotesSubscriptions } from "./engagementNotes/writeEngagementNote"
import { view as engagementPlansView } from "./engagementPlans/view"
import { subscriptions as engagementPlansSubscriptions } from "./engagementPlans/writeEngagementPlans"
import { EngagementNote } from "./engagementNotes"
import { EngagementLevels } from "./engagementPlans"
import { Subscription } from "@/display/message"

export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: Array<EngagementNote>
  user: User
}

export type Model
  = Informative
  | Personalized


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
            engagementPlansView(model.learningArea, model.engagementLevels),
            engagementNotesView(model.learningArea, model.engagementNotes)
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
  view,
  subscriptions: [
    ...engagementPlansSubscriptions.map(withPersonalizedModel),
    ...engagementNotesSubscriptions.map(withPersonalizedModel)
  ]
}

function withPersonalizedModel(subscription: Subscription<Personalized, any>): Subscription<Model, any> {
  return {
    messageType: subscription.messageType,
    update: (state, message) => {
      if (state.type === "personalized") {
        subscription.update?.(state, message)
      }
    },
    dispatch: (dispatch, state, message) => {
      if (state.type === "personalized") {
        subscription.dispatch?.(dispatch, state, message)
      }
    }
  }
}

export default display