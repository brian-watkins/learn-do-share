import * as Html from "@/display/markup"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}


export function learningAreaCategoryView(area: LearningArea): Html.ViewChild {
  return Html.div([Html.id("learning-area-category"), Html.cssClasses([
    "capitalize",
    "py-2",
    "px-4",
    "my-8",
    "mx-16",
    "bg-fuchsia-500",
    "rounded",
    "text-neutral-50",
    "border-2",
    "border-fuchsia-500",
    "capitalize",
    "font-bold"
  ])], [
    Html.text(area.category)
  ])
}

export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.id("learning-area-title"), Html.cssClasses([
    "font-bold",
    "text-sky-800",
    "text-8xl",
    "mb-8",
    "mx-16"
  ])], [
    Html.text(area.title),
  ])
}
