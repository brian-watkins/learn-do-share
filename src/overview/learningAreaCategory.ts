import * as Html from "@/display/markup"

export enum LearningAreaCategory {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export function learningAreaCategoryView(category: LearningAreaCategory, areaViews: Array<Html.View>): Html.View {
  return Html.section([
    Html.id(`${category}-learning-areas`),
    learningAreaCategoryStyles()
  ], [
    learningAreaCategoryTitle(category),
    ...areaViews
  ])
}

function learningAreaCategoryTitle(title: string): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "py-2": true },
      { "px-4": true },
      { "my-2": true },
      { "font-bold": true },
      { "bg-indigo-700": true },
      { "rounded": true },
      { "text-neutral-50": true },
      { "capitalize": true },
    ])
  ], [
    Html.text(title)
  ])
}

function learningAreaCategoryStyles(): Html.ViewAttribute {
  return Html.cssClassList([
    { "flex": true },
    { "flex-col": true },
    { "gap-8": true }
  ])
}
