import * as Html from "@/display/markup"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}


export function learningAreaCategoryView(area: LearningArea): Html.ViewChild {
  return Html.div([Html.id("learning-area-category"), Html.cssClassList([
    { "capitalize": true },
    { "py-2": true },
    { "px-4": true },
    { "my-8": true },
    { "mx-16": true },
    { "bg-fuchsia-500": true },
    { "rounded": true },
    { "text-neutral-50": true },
    { "border-2": true },
    { "border-fuchsia-500": true },
    { "capitalize": true },
    { "font-bold": true }
  ])], [
    Html.text(area.category)
  ])
}

export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.id("learning-area-title"), Html.cssClassList([
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-8xl": true },
    { "mb-8": true },
    { "mx-16": true }
  ])], [
    Html.text(area.title),
  ])
}
