import * as Html from "../display/markup"
import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { EngagementPlansContent } from "./readEngagementPlans"
import { decorate, markdownToHTML } from "./util/markdownParser"
import { asListItem } from "./viewHelpers"
import { writeEngagementPlan } from "./writeEngagementPlans"

export interface LearningAreaOpened {
  type: "learningAreaOpened"
  area: LearningArea
}

function learningAreaOpened(area: LearningArea): LearningAreaOpened {
  return {
    type: "learningAreaOpened",
    area
  }
}

export interface LearningArea {
  id: string
  title: string
  content: string
}

function viewLearningArea(selected: LearningArea | null, engagementPlans: EngagementPlansContent): (learningArea: LearningArea) => Html.View {
  return (learningArea) => {
    if (learningArea.title === selected?.title) {
      return Html.article([cardStyle()], [
        viewTitle(learningArea, engagementPlans),
        viewContent(learningArea),
        indicateEngagement(learningArea)
      ])
    } else {
      return Html.article([cardStyle(), Html.onClick(learningAreaOpened(learningArea))], [
        viewTitle(learningArea, engagementPlans)
      ])
    }
  }
}

function viewTitle(area: LearningArea, engagementPlans: EngagementPlansContent): Html.ViewChild {
  return Html.h3([Html.cssClassList([
    { "p-4": true },
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-lg": true }
  ])], [
    Html.text(area.title),
    engagementPlansView(area, engagementPlans)
  ])
}

function engagementPlansView(area: LearningArea, engagementPlans: EngagementPlansContent): Html.ViewChild {
  switch (engagementPlans.type) {
    case "engagementPlansLoaded":
      const plan = engagementPlans.plans.find(plan => plan.learningArea === area.id)
      if (plan) {
        switch (plan?.level) {
          case "doing":
            return engagementPlanView("Doing")
          case "learning":
            return engagementPlanView("Learning")
          case "sharing":
            return engagementPlanView("Sharing")
          default:
            return Html.text("")  
        }    
      } else {
        return Html.text("")
      }
    default:
      return Html.text("")
  }
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([ Html.data("engagement-indicator") ], [
    Html.text(level)
  ])
}

function viewContent(area: LearningArea): Html.ViewChild {
  return Html.p([
    Html.id("learning-area-content"),
    Html.cssClassList([
      { "p-4": true },
      { "border-solid": true },
      { "border-sky-800": true },
      { "border-t-2": true }
    ]),
    Html.withHTMLContent(markdownToHTML(area.content, [
      decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
      decorate("h1", { classname: "font-bold text-lg" }),
      decorate("h3", { classname: "font-bold" }),
      decorate("ul", { classname: "list-disc list-inside" }),
      decorate("p", { classname: "pt-4 pb-4 max-w-lg" })
    ]))
  ], [])
}

function indicateEngagement(learningArea: LearningArea): Html.ViewChild {
  return Html.section([], [
    engagementPlanInput(learningArea, "I am learning it!", EngagementLevel.Learning),
    engagementPlanInput(learningArea, "I am doing it!", EngagementLevel.Doing),
    engagementPlanInput(learningArea, "I am sharing it!", EngagementLevel.Sharing),
  ])
}

function engagementPlanInput(learningArea: LearningArea, label: string, value: EngagementLevel): Html.ViewChild {
  return Html.label([], [
    Html.text(label),
    Html.input([
      Html.type("radio"),
      Html.name("engagement-plan"),
      Html.value(value),
      Html.onInput((level) => engagementPlanSelected(learningArea.id, level as EngagementLevel))
    ], [])
  ])
}

export function engagementPlanSelected(areaId: string, level: EngagementLevel) {
  return writeEngagementPlan(engagementPlan(areaId, level))
}

function cardStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "m-4": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true }])
}

export function learningAreasView(learningAreas: Array<LearningArea>, selected: LearningArea | null, engagementPlans: EngagementPlansContent): Html.View {
  if (learningAreas.length == 0) {
    return Html.h1([ Html.id("learning-areas") ], [
      Html.text("There is nothing to learn!")
    ])
  }

  return Html.section([
    Html.id("learning-areas"),
    Html.cssClassList([
    { "flex": true },
    { "place-content-center": true }
  ])], [
    Html.ul([Html.cssClassList([
      { "basis-3/6": true },
      { "shrink-0": true },
      { "min-w-fit": true }
    ])], learningAreas.map(viewLearningArea(selected, engagementPlans)).map(asListItem))
  ])
}