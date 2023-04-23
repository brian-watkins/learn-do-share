import * as Html from "loop/display"
import * as Style from "../../style.js"
import { meta, State, trigger } from "loop"
import { engagementLevels, increaseEngagementLevelRule, increaseEngagementText } from "./index.js"

export default Html.withState((get) => {
  const levels = get(engagementLevels)

  return Html.div([
    Html.id("engagement-plans"),
    Html.cssClasses([
      "flex",
      "flex-col",
      "gap-4"
    ])
  ], [
    Html.div([
      Html.cssClasses([
        "flex",
        "gap-4"
      ])
    ], [
      ...levels.map(engagementPlanView),
      Html.withState(increaseEngagementButton)
    ])
  ])
})


function increaseEngagementButton(get: <S>(state: State<S>) => S): Html.View {
  const isSaving = get(meta(engagementLevels)).type === "pending"

  return Html.button([
    Style.link(),
    Html.data("increase-engagement"),
    Html.onClick(trigger(increaseEngagementLevelRule)),
    Html.disabled(isSaving)
  ], [
    Html.text(get(increaseEngagementText))
  ])
}

function engagementPlanView(level: string): Html.View {
  return Html.div([
    Style.tag(Style.Colors.Engagement),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}
