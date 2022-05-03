// import { learningAreasView, LearningAreaOpened, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "../../display/markup"
// import { DataMessage } from "./backstage"
// import { BackstageMessage } from "../display/backstage"
import { Display } from "../../display/display"
// import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"
// import { loginView, userAccountView } from "./user"
// import { PersonalizedLearningArea, personalizedLearningAreaView } from "./personalizedLearningAreas"
// import { User } from "../../api/common/user"
import { LearningArea, learningAreaContentView, learningAreaTitleView } from "./learningArea"
import { User } from "../../api/common/user"
import { engagementPlansView, increaseEngagementButton, PersonalizedLearningArea } from "./personalizedLearningArea"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "../writeEngagementPlans"
import { AppModel, AppState } from "../app"
import { toPersonalizedLearningArea } from "../personalizedLearningAreas"
import { storeForSession } from "../../display/session"

// export interface Informative {
// type: "informative"
// learningArea: LearningArea
// }

// export interface UnknownArea {
// type: "unknown-area"
// }

// export interface Personalized {
// type: "personalized"
// learningArea: PersonalizedLearningArea
// user: User
// }

// I need to somehow use one AppState if we want to persist the state in the session storage
// And I need to update things so that the engagement plan is recorded so when the main page
// appears, it is shown. 
// Maybe what we need is that there's a map of learning area id to a list of engagement plans
// And this gets shared by this page and the main page.
// So maybe there's always a list of learning areas and a selected learning area type
// then there's informative or personalized. And personalized has user and engagement levels map.



// export type AppState
// = Informative
// | UnknownArea
// | Personalized

type EngageMessage
  = EngagementPlanPersisted
  | EngagementPlansDeleted

function update(model: AppModel, action: EngageMessage): void {
  switch (model.state.type) {
    case "personalized":
      switch (action.type) {
        case "engagementPlanPersisted": {
          const list = model.state.engagementLevels[action.plan.learningArea]
          if (!list) {
            model.state.engagementLevels[action.plan.learningArea] = [action.plan.level]
          } else {
            model.state.engagementLevels[action.plan.learningArea].push(action.plan.level)
          }
          break
        }
        case "engagementPlansDeleted": {
          model.state.engagementLevels[action.learningArea] = []
          break
        }
      }
  }
}

// View

function view(model: AppModel): Html.View {
  switch (model.selectedLearningArea.type) {
    case "learning-area-not-found":
      return Html.div([], [
        Html.text("Not done yet!")
      ])
    case "learning-area-not-selected":
      return Html.div([], [
        Html.text("Should not get here?!")
      ])
    case "learning-area-selected":
      const learningArea = model.selectedLearningArea.learningArea
      switch (model.state.type) {
        case "informative":
          return Html.article([], [
            Html.div([Html.id("learning-area-category"), Html.cssClassList([
              { "capitalize": true }
            ])], [
              Html.text(learningArea.category)
            ]),
            learningAreaTitleView(learningArea),
            learningAreaContentView(learningArea),

            // loginView(),
            // learningAreasView(appState.learningAreas, learningAreaView)
          ])
        case "personalized":
          return Html.article([], [
            Html.div([
              Html.cssClassList([
                { "basis-1/4": true },
                { "flex": true },
                { "flex-col": true },
              ])
            ], [
              learningAreaTitleView(learningArea),
              engagementPlansView(model.state.engagementLevels[learningArea.id] ?? []),
            ]),
            Html.div([
              Html.cssClassList([
                { "basis-3/4": true }
              ])
            ], [
              learningAreaContentView(learningArea),
              increaseEngagementButton(toPersonalizedLearningArea(model.state.engagementLevels, learningArea))
            ])
          ])
      }
  }
  // case "personalized":
  // return Html.div([], [
  // userAccountView(appState.user),
  // learningAreasView(appState.learningAreas, personalizedLearningAreaView) 
  // ])
  // }
}

const display: Display<AppModel, any> = {
  update,
  view,
  subscription: (model: AppModel, dispatch: (message: any) => void) => {
    console.log("dispatch a session message on model change!")
    dispatch(storeForSession({ state: model.state }))
  }
}

export default display