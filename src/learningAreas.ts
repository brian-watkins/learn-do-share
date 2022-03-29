import * as Html from "../display/markup"
import { asListItem } from "./viewHelpers"

export class LearningAreasLoaded {
  type: "learningAreasLoaded" = "learningAreasLoaded"
  constructor(public areas: Array<LearningArea>) {}
}

export class LearningAreasLoading {
  type: "learningAreasLoading" = "learningAreasLoading"
}

export type LearningAreasContent = LearningAreasLoaded | LearningAreasLoading

export interface LearningArea {
  title: string
}

function viewLearningArea(learningArea: LearningArea): Html.View {
  return Html.article([ Html.cssClassList([
    { "p-4": true },
    { "m-4": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true }
  ])], [
    Html.h3([ Html.cssClassList([
      { "font-bold": true },
      { "text-sky-800": true }
    ])], [ Html.text(learningArea.title) ])
  ])
}

export function learningAreasView(learningAreas: Array<LearningArea>): Html.View {
  if (learningAreas.length == 0) {
    return Html.h1([], [
      Html.text("There is nothing to learn!")
    ])
  }

  return Html.section([ Html.cssClassList([
    { "flex": true },
    { "place-content-center": true }
  ]) ], [
    Html.ul([ Html.cssClassList([
      { "basis-3/6": true },
      { "shrink-0": true },
      { "min-w-fit": true }
    ]) ], learningAreas.map(viewLearningArea).map(asListItem))
  ])
}
