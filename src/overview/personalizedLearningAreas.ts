import { LearningArea, learningAreaTitleView } from "./learningAreas"
import * as Html from '@/display/markup'
import * as Style from "../style"
import { cardBox } from "../viewElements"
import { learningAreaCategoryTitle } from "./learningAreaCategory"

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
      cardBox([
        Html.data("learning-area", personalized.id )
      ], [
        learningAreaCategoryTitle(learningArea.category),
        learningAreaTitleView(personalized),
        engagementPlansView(personalized.engagementLevels)
      ])
    ])
  }
}

function engagementPlansView(engagementLevels: Array<EngagementLevel>): Html.ViewChild {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-4"
    ])
  ], engagementLevels.map(engagementPlanView))
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Style.tag(Style.Colors.Engagement),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}
