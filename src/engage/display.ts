import * as Html from "loop/display"
import { learningArea, LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea.js"
import { learningAreaContentView } from "./learningAreaContent.js"
import { footer, header, linkBox } from "../viewElements.js"
import { userAccountView } from "../user.js"
import { meta, State } from "loop"
import { engagementPlansView } from "./engagementPlans/view.js"
import { engagementNotesView } from "./engagementNotes/view.js"
import { session } from "./session.js"
import { engagementLevels } from "./engagementPlans/index.js"
import { engagementNotes } from "./engagementNotes/index.js"

// View

function view(): Html.View {
  return page([
    Html.withState(pageError),
    pageHeader([
      learningAreasLink(),
      Html.withState(sessionView)
    ]),
    Html.withState(learningAreaCategoryView),
    Html.withState(learningAreaTitleView),
    Html.withState(contentView)
  ])
}

function sessionView(get: <S>(state: State<S>) => S): Html.View {
  const userSession = get(session)
  switch (userSession.type) {
    case "public-session":
      return loginView(get(learningArea))
    case "personalized-session":
      return userAccountView(userSession.user)
  }
}

function contentView(get: <S>(state: State<S>) => S): Html.View {
  const userSession = get(session)
  const area = get(learningArea)
  switch (userSession.type) {
    case "public-session":
      return learningAreaContentView(area)
    case "personalized-session":
      return contentArea([
        learningAreaContentView(area),
        contentColumn([
          Html.withState(engagementPlansView),
          Html.withState(engagementNotesView)
        ])
      ])
  }
}

function pageError(get: <S>(state: State<S>) => S): Html.View {
  const hasError = get(meta(engagementLevels)).type === "error" ||
    get(meta(engagementNotes)).type === "error"

  if (!hasError) {
    return Html.div([], [])
  }

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

export default () => Html.display(view())