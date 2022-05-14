import { LearningArea, learningAreaTitleView } from "./learningAreas"
import * as Html from '../../display/markup'
import { cardView } from "../viewElements"

type EngagementLevel = string

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function toPersonalizedLearningArea(levels: { [key: string]: Array<EngagementLevel> }, area: LearningArea): PersonalizedLearningArea {
  return {
    ...area,
    engagementLevels: levels[area.id] ?? []
  }
}

export function personalizedLearningAreaView(levels: { [key: string]: Array<EngagementLevel> }): (learningArea: LearningArea) => Html.View {
  return (learningArea) => {
    const personalized = toPersonalizedLearningArea(levels, learningArea)
    return Html.a([Html.href(`/learning-areas/${personalized.id}`)], [
      cardView([], [
        learningAreaTitleView(personalized),
        engagementPlansView(personalized.engagementLevels)
      ])
    ])
  }
}

function engagementPlansView(engagementLevels: Array<EngagementLevel>): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "grow": true }
    ])
  ], engagementLevels.map(engagementPlanView))
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "py-2": true },
      { "px-4": true },
      { "my-2": true },
      { "mr-2": true },
      { "bg-cyan-500": true },
      { "rounded": true },
      { "text-neutral-50": true },
      { "w-auto": true },
      { "inline-block": true },
      { "capitalize": true }
    ]),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}
