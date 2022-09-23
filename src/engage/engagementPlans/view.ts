import * as Html from "@/display/markup"
import * as Style from "../../style"
import { LearningArea } from "../learningArea"
import { EngagementLevel, EngagementLevels, engagementPlan, nextEngagementLevel } from "."
import { deleteEngagementPlans } from "./deleteEngagementPlans"
import { writeEngagementPlan } from "./saveEngagementPlan"


export function view(area: LearningArea, levels: EngagementLevels): Html.View {
  return Html.div([ Html.cssClasses([
    "flex",
    "flex-col",
    "gap-4"
  ]) ], [
    Html.div([
      Html.cssClasses([
        "flex",
        "gap-4"
      ])
    ], [...levels.levels.map(engagementPlanView), increaseEngagementButton(area, levels)])  
  ])
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Style.tag(Style.Colors.Engagement),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}

export function increaseEngagementButton(learningArea: LearningArea, levels: EngagementLevels): Html.ViewChild {
  return Html.button([
    Style.link(),
    Html.data("increase-engagement"),
    Html.onClick(nextEngagementLevelMessage(learningArea, levels.levels)),
    Html.disabled(isSavingEngagementLevels(levels))
  ], [
    Html.text(increaseEngagementText(levels.levels))
  ])
}

function isSavingEngagementLevels(engagementLevels: EngagementLevels) {
  return engagementLevels.type === "engagement-levels-saving"
}

function increaseEngagementText(levels: Array<EngagementLevel>): string {
  switch (nextEngagementLevel(levels)) {
    case EngagementLevel.Learning:
      return "I'm ready to learn!"
    case EngagementLevel.Doing:
      return "Let's do it!"
    case EngagementLevel.Sharing:
      return "I'm ready to share!"
    case EngagementLevel.None:
      return "I'm done for now!"
  }
}

function nextEngagementLevelMessage(learningArea: LearningArea, levels: Array<EngagementLevel>) {
  const nextLevel = nextEngagementLevel(levels)
  if (nextLevel === EngagementLevel.None) {
    return deleteEngagementPlans(learningArea)
  } else {
    return writeEngagementPlan(engagementPlan(learningArea, nextLevel))
  }
}
