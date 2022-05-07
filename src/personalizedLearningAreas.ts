import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { LearningArea, learningAreaTitleView } from "./learningAreas"
import * as Html from '../display/markup'
import { deleteEngagementPlans, writeEngagementPlan } from "./writeEngagementPlans"
import { cardView } from "./viewElements"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function toPersonalizedLearningArea(levels: { [key:string]: Array<EngagementLevel> }, area: LearningArea): PersonalizedLearningArea {
  return {
    ...area,
    engagementLevels: levels[area.id] ?? []
  }
}

export function personalizedLearningAreaView(levels: { [key:string]: Array<EngagementLevel> }): (learningArea: LearningArea) => Html.View {
  return (learningArea) => {
    const personalized = toPersonalizedLearningArea(levels, learningArea)
    // if (learningArea.selected) {
    //   return fullView([], [
    //     Html.div([
    //       Html.cssClassList([
    //         { "basis-1/4": true },
    //         { "flex": true },
    //         { "flex-col": true },
    //       ])
    //     ], [
    //       learningAreaTitleView(learningArea),
    //       engagementPlansView(learningArea.engagementLevels),
  
    //     ]),
    //     Html.div([
    //       Html.cssClassList([
    //         { "basis-3/4": true }
    //       ])
    //     ], [
    //       // learningAreaContentView(learningArea),
    //       increaseEngagementButton(learningArea)
    //     ])
    //   ])
    // } else {
      // return cardView([Html.onClick(learningAreaOpened(learningArea))], [
        // learningAreaTitleView(learningArea),
        // engagementPlansView(learningArea.engagementLevels)
      // ])
      return Html.a([ Html.href(`/learning-areas/${personalized.id}`) ], [
        cardView([], [
          learningAreaTitleView(personalized),
          engagementPlansView(personalized.engagementLevels)
        ])
      ])
    // }
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

  return Html.div([
    Html.cssClassList([
      { "grow": true }
    ])
  ], levelViews)
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
      { "inline-block": true }
    ]),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}

function increaseEngagementButton(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.section([
    Html.cssClassList([
      { "mt-8": true },
      { "max-w-lg": true }
    ])
  ], [
    Html.button([
      Html.cssClassList([
        { "w-full": true },
        { "px-4": true },
        { "py-2": true },
        { "rounded": true },
        { "border-2": true },
        { "border-sky-200": true },
        { "border-solid": true },
        { "text-sky-400": true }
      ]),
      Html.data("increase-engagement"),
      Html.onClick(nextEngagementLevelMessage(learningArea))
    ], [
      Html.text(increaseEngagementText(learningArea))
    ])
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
