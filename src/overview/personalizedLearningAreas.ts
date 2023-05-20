import { LearningArea, learningAreaTitleView } from "./learningAreas.js"
import * as Html from 'display-party'
import * as Style from "../style.js"
import { cardBox } from "../viewElements.js"
import { learningAreaCategoryTitle } from "./learningAreaCategory.js"
import { Colors } from "../style.js"

type EngagementLevel = string

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
  engagementNoteCount: number
}

export function personalizedLearningAreaView(learningArea: PersonalizedLearningArea): Html.View {
  return Html.a([Html.href(`/learning-areas/${learningArea.id}`)], [
    cardBox([
      Html.data("learning-area", learningArea.id)
    ], [
      learningAreaCategoryTitle(learningArea.category),
      learningAreaTitleView(learningArea),
      engagementIndicators([
        ...learningArea.engagementLevels.map(engagementPlanView),
        ...noteCountView(learningArea.engagementNoteCount)
      ])
    ])
  ])
}

function noteCountView(count: number): Array<Html.View> {
  if (count == 0) {
    return []
  }

  return [
    Html.div([
      Html.data("note-count"),
      Html.cssClasses([
        "rounded",
        "capitalize",
        "font-bold",
        Style.textColor(Colors.Engagement),
        "py-2",
        "px-4",
        "border-2",
        "border-solid",
        Style.borderColor(Colors.Engagement),
      ])
    ], [
      Html.text(`${count} Note${count > 1 ? 's' : ''}`)
    ])
  ]
}

function engagementIndicators(engagementIndicators: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-4"
    ])
  ], engagementIndicators)
}

function engagementPlanView(level: string): Html.View {
  return Html.div([
    Style.tag(Style.Colors.Engagement),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}
