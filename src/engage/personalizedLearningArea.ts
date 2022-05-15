import * as Html from "@/display/markup"
import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { deleteEngagementPlans, writeEngagementPlan } from "./writeEngagementPlans"
import { LearningArea } from "./learningArea"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function engagementPlansView(area: PersonalizedLearningArea): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "ml-16": true },
      { "mb-8": true },
      { "flex": true },
      { "gap-4": true }
    ])
  ], [...area.engagementLevels.map(engagementPlanView), increaseEngagementButton(area)])
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "py-2": true },
      { "px-4": true },
      { "bg-cyan-500": true },
      { "rounded": true },
      { "border-2": true },
      { "border-cyan-500": true },
      { "text-neutral-50": true },
      { "w-auto": true },
      { "inline-block": true },
      { "capitalize": true },
      { "font-bold": true }
    ]),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}

export function increaseEngagementButton(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.button([
    Html.cssClassList([
      { "px-4": true },
      { "py-2": true },
      { "rounded": true },
      { "border-cyan-800": true },
      { "border-2": true },
      { "border-dotted": true },
      { "text-cyan-800": true },
      { "inline-block": true },
      { "font-bold": true }
    ]),
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
