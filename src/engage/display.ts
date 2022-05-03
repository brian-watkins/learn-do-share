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
import { EngagementPlanPersisted } from "../writeEngagementPlans"

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

// I need to somehow use one AppState if we want to persist the state in the session storage
// And I need to update things so that the engagement plan is recorded so when the main page
// appears, it is shown. 
// Maybe what we need is that there's a map of learning area id to a list of engagement plans
// And this gets shared by this page and the main page.
// So maybe there's always a list of learning areas and a selected learning area type
// then there's informative or personalized. And personalized has user and engagement levels map.



export type AppState
  = Informative
  | UnknownArea
  | Personalized

type EngageMessage
  = EngagementPlanPersisted
// | EngagementPlansDeleted

function update(state: AppState, action: EngageMessage): void {
  switch (state.type) {
    case "personalized":
      switch (action.type) {
        case "engagementPlanPersisted": {
          state.learningArea.engagementLevels.push(action.plan.level)
          break
        }
        //     case "engagementPlansDeleted": {
        //       const index = state.learningAreas.findIndex(area => {
        //         return area.id === action.learningArea
        //       })
        //       state.learningAreas[index].engagementLevels = []
        //       break
        //     }
      }
  }
}

// View

function view(appState: AppState): Html.View {
  switch (appState.type) {
    case "informative":
      return Html.div([], [
        Html.div([Html.id("learning-area-category"), Html.cssClassList([
          { "capitalize": true }
        ])], [
          Html.text(appState.learningArea.category)
        ]),
        learningAreaTitleView(appState.learningArea),
        learningAreaContentView(appState.learningArea),

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
          learningAreaTitleView(appState.learningArea),
          engagementPlansView(appState.learningArea.engagementLevels),
        ]),
        Html.div([
          Html.cssClassList([
            { "basis-3/4": true }
          ])
        ], [
          learningAreaContentView(appState.learningArea),
          increaseEngagementButton(appState.learningArea)
        ])
      ])
    case "unknown-area":
      return Html.div([], [
        Html.text("Not done yet!")
      ])
  }
  // case "personalized":
  // return Html.div([], [
  // userAccountView(appState.user),
  // learningAreasView(appState.learningAreas, personalizedLearningAreaView) 
  // ])
  // }
}


const display: Display<AppState, any> = {
  update,
  view
}

export default display