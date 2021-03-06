import * as Html from "@/display/markup"
import * as Style from "../style"
import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { deleteEngagementPlans, writeEngagementPlan } from "./writeEngagementPlans"
import { LearningArea } from "./learningArea"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
  engagementNotes: Array<EngagementNote>
}

export interface EngagementNote {
  id: string
  content: string,
  date: string
}

export function engagementPlansView(area: PersonalizedLearningArea): Html.View {
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
    ], [...area.engagementLevels.map(engagementPlanView), increaseEngagementButton(area)])  
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

export function increaseEngagementButton(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.button([
    Style.link(),
    Html.data("increase-engagement"),
    Html.onClick(nextEngagementLevelMessage(learningArea))
  ], [
    Html.text(increaseEngagementText(learningArea))
  ])
}

function increaseEngagementText(learningArea: PersonalizedLearningArea): string {
  switch (nextEngagementLevel(learningArea)) {
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

function nextEngagementLevelMessage(learningArea: PersonalizedLearningArea) {
  const nextLevel = nextEngagementLevel(learningArea)
  if (nextLevel === EngagementLevel.None) {
    return deleteEngagementPlans(learningArea)
  } else {
    return writeEngagementPlan(engagementPlan(learningArea, nextLevel))
  }
}

function nextEngagementLevel(learningArea: PersonalizedLearningArea): EngagementLevel {
  if (learningArea.engagementLevels.includes(EngagementLevel.Sharing)) {
    return EngagementLevel.None
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Doing)) {
    return EngagementLevel.Sharing
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Learning)) {
    return EngagementLevel.Doing
  }
  return EngagementLevel.Learning
}

export function engagementPlanSelected(area: LearningArea, level: EngagementLevel) {
  return writeEngagementPlan(engagementPlan(area, level))
}
