import * as Html from "@/display/markup"
import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { deleteEngagementPlans, writeEngagementPlan } from "./writeEngagementPlans"
import { LearningArea } from "./learningArea"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function engagementPlansView(area: PersonalizedLearningArea): Html.ViewChild {
  return Html.div([
    Html.cssClasses([
      "ml-16",
      "mb-8",
      "flex",
      "gap-4"
    ])
  ], [...area.engagementLevels.map(engagementPlanView), increaseEngagementButton(area)])
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Html.cssClasses([
      "py-2",
      "px-4",
      "bg-cyan-500",
      "rounded",
      "border-2",
      "border-cyan-500",
      "text-neutral-50",
      "w-auto",
      "inline-block",
      "capitalize",
      "font-bold"
    ]),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}

export function increaseEngagementButton(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.button([
    Html.cssClasses([
      "px-4",
      "py-2",
      "rounded",
      "border-cyan-800",
      "border-2",
      "border-dotted",
      "text-cyan-800",
      "inline-block",
      "font-bold"
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
