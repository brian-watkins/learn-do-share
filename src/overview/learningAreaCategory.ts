import * as Html from "@/display/markup"

export enum LearningAreaCategory {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export function learningAreaCategoryTitle(category: LearningAreaCategory): Html.ViewChild {
  let classes: Array<Html.CssClassToggle> = [
    { "py-2": true },
    { "px-4": true },
    { "my-2": true },
    { "font-bold": true },
    { "rounded": true },
    { "text-neutral-50": true },
    { "capitalize": true },
  ]
  
  switch (category) {
    case LearningAreaCategory.Discipline:
      classes.push({ "bg-fuchsia-500": true })
      break
    case LearningAreaCategory.Team:
      classes.push({ "bg-purple-700": true })
      break
    case LearningAreaCategory.Theory:
      classes.push({ "bg-indigo-600": true })
      break
  }

  return Html.div([
    Html.cssClassList(classes)
  ], [
    Html.text(category)
  ])
}
