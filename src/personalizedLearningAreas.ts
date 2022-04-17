import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { LearningArea, learningAreaContentView, learningAreaOpened, learningAreaTitleView } from "./learningAreas"
import * as Html from '../display/markup'
import { writeEngagementPlan } from "./writeEngagementPlans"
import { cardView } from "./viewElements"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function personalizedLearningAreaView(learningArea: PersonalizedLearningArea): Html.View {
  if (learningArea.selected) {
      return cardView([], [
        learningAreaTitleView(learningArea),
        engagementPlansView(learningArea.engagementLevels),
        learningAreaContentView(learningArea),
        indicateEngagement(learningArea)
      ])
  } else {
    return cardView([Html.onClick(learningAreaOpened(learningArea))], [
      learningAreaTitleView(learningArea),
      engagementPlansView(learningArea.engagementLevels)
    ])
  }
}

function engagementPlansView(engagementLevels: Array<EngagementLevel>): Html.ViewChild {
  let levelViews: Array<Html.ViewChild> = []

  for (const level of engagementLevels) {
    switch (level) {
      case EngagementLevel.Doing:
        levelViews.push(engagementPlanView("Doing"))
        break
      case EngagementLevel.Learning:
        levelViews.push(engagementPlanView("Learning"))
        break
      case EngagementLevel.Sharing:
        levelViews.push(engagementPlanView("Sharing"))
        break
    }
  }

  return Html.div([], levelViews)
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([Html.data("engagement-indicator")], [
    Html.text(level)
  ])
}

function indicateEngagement(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.section([], [
    engagementPlanInput(learningArea, "I am learning it!", EngagementLevel.Learning),
    engagementPlanInput(learningArea, "I am doing it!", EngagementLevel.Doing),
    engagementPlanInput(learningArea, "I am sharing it!", EngagementLevel.Sharing),
  ])
}

function engagementPlanInput(learningArea: PersonalizedLearningArea, label: string, value: EngagementLevel): Html.ViewChild {
  return Html.label([], [
    Html.text(label),
    Html.input([
      Html.type("radio"),
      Html.name("engagement-plan"),
      Html.data("area", learningArea.id),
      Html.value(value),
      Html.onInput((level) => engagementPlanSelected(learningArea.id, level as EngagementLevel))
    ], [])
  ])
}

export function engagementPlanSelected(areaId: string, level: EngagementLevel) {
  return writeEngagementPlan(engagementPlan(areaId, level))
}
