// import * as Html from "@/display/markup"
// import { DisplayConfig } from "@/display/display"
import * as Html from "loop/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea.js"
import { User } from "@/api/common/user.js"
import { learningAreaContentView } from "./learningAreaContent.js"
import { footer, header, linkBox } from "../viewElements.js"
import { userAccountView } from "../user.js"
import { EngagementNotes, engagementNotesRetrieved } from "./engagementNotes/index.js"
import { EngagementLevels, engagementLevelsRetrieved } from "./engagementPlans/index.js"
import { deleteNote } from "./engagementNotes/deleteNote.js"
import { saveNote } from "./engagementNotes/saveNote.js"
import { saveEngagementPlan } from "./engagementPlans/saveEngagementPlan.js"
import { deleteEngagementPlansProcedure } from "./engagementPlans/deleteEngagementPlans.js"
import { mapAll } from "../util/procedures.js"
import { State, state, withDerivedValue } from "loop"
import { engagementPlansView } from "./engagementPlans/view.js"
import { engagementNotesView } from "./engagementNotes/view.js"
import { Session, session } from "./model.js"




// View

function view(): Html.View {
  const appSession = session()
  return page([
    pageHeader([
      learningAreasLink(),
      appSession.type === "public-session" ?
        loginView(appSession.learningArea) :
        userAccountView(appSession.user)
    ]),
    learningAreaCategoryView(appSession.learningArea),
    learningAreaTitleView(appSession.learningArea),
    contentView(appSession)
  ])
}

function contentView(session: Session): Html.View {
  switch (session.type) {
    case "public-session":
      return learningAreaContentView(session.learningArea)
    case "personalized-session":
      return contentArea([
        learningAreaContentView(session.learningArea),
        contentColumn([
          Html.viewGenerator(engagementPlansView(session.learningArea, session.engagementLevels)),
          Html.viewGenerator(engagementNotesView(session.learningArea, session.engagementNotes))
        ])
      ])
  }
}

// const loginView = state(withDerivedValue(get => {
  // return linkBox(`/login?redirect=/learning-areas/${get(learningArea).id}`, "Login")
// }))

// function sview(model: Model): Html.View {
//   switch (model.type) {
//     case "informative":
//       return page([
//         pageHeader([
//           learningAreasLink(),
//           loginView(model.learningArea)
//         ]),
//         learningAreaCategoryView(model.learningArea),
//         learningAreaTitleView(model.learningArea),
//         learningAreaContentView(model.learningArea)
//       ])
//     case "personalized":
//       return page([
//         pageHeader([
//           learningAreasLink(),
//           userAccountView(model.user)
//         ]),
//         learningAreaCategoryView(model.learningArea),
//         learningAreaTitleView(model.learningArea),
//         contentArea([
//           learningAreaContentView(model.learningArea),
//           contentColumn([
//             engagementPlansView(model.learningArea, model.engagementLevels),
//             engagementNotesView(model.learningArea, model.engagementNotes)
//           ])
//         ])
//       ])
//       // return Html.div([], [
//         // personalizedEngagePage(model)
//       // ])
//     case "error":
//       return Html.div([], [
//         pageError(),
//         personalizedEngagePage(model)
//       ])
//   }
// }

// function personalizedEngagePage(model: Personalized | Error): Html.View {
//   return page([
//     pageHeader([
//       learningAreasLink(),
//       userAccountView(model.user)
//     ]),
//     learningAreaCategoryView(model.learningArea),
//     learningAreaTitleView(model.learningArea),
//     contentArea([
//       learningAreaContentView(model.learningArea),
//       contentColumn([
//         engagementPlansView(model.learningArea, model.engagementLevels),
//         engagementNotesView(model.learningArea, model.engagementNotes)
//       ])
//     ])
//   ])
// }

function pageError(): Html.View {
  return Html.div([
    Html.data("error"),
    Html.cssClasses([
      "bg-green-100",
      "h-screen",
      "w-screen",
      "flex",
      "justify-center",
      "items-center",
      "gap-16",
      "fixed",
      "animate-slidein",
      "opacity-90"
    ])
  ], [
    errorText(),
    errorText(),
    errorText(),
    errorText(),
  ])
}

function errorText(): Html.View {
  return Html.p([
    Html.cssClasses([
      "text-center",
      "text-2xl",
      "font-bold",
      "uppercase"
    ])
  ], [
    Html.text("Error")
  ])
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([], views)
}

function page(views: Array<Html.View>): Html.View {
  return Html.article([
    Html.cssClasses([
      "flex-col",
      "flex",
      "min-h-screen"
    ])
  ], [
    ...views,
    footer([
      Html.cssClasses([
        "mt-24"
      ])
    ])
  ])
}

function contentArea(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-32",
      "grow"
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

// function toPersonalized(model: Model): Personalized | Error {
//   if (model.type === "personalized" || model.type === "error") {
//     return model
//   } else {
//     return {
//       type: "error",
//       learningArea: { id: "", title: "", content: "", category: LearningAreaCategory.Discipline },
//       engagementLevels: engagementLevelsRetrieved([]),
//       engagementNotes: engagementNotesRetrieved([]),
//       user: { identifier: "", name: "" }
//     }
//   }
// }

// const display: DisplayConfig<Model> = {
//   view,
//   procedures: mapAll(toPersonalized, [
//     saveNote,
//     deleteNote,
//     saveEngagementPlan,
//     deleteEngagementPlansProcedure
//   ])
// }

export default () => Html.display(view())