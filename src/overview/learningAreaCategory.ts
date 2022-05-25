import * as Html from "@/display/markup"

export enum LearningAreaCategory {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export function learningAreaCategoryTitle(category: LearningAreaCategory): Html.ViewChild {
  let classes: Array<Html.CssClassname> = [
    "py-2",
    "px-4",
    "my-2",
    "font-bold",
    "rounded",
    "text-neutral-50",
    "capitalize",
  ]
  
  switch (category) {
    case LearningAreaCategory.Discipline:
      classes.push("bg-fuchsia-500")
      break
    case LearningAreaCategory.Team:
      classes.push("bg-purple-700")
      break
    case LearningAreaCategory.Theory:
      classes.push("bg-indigo-600")
      break
  }

  return Html.div([
    Html.cssClasses(classes)
  ], [
    Html.text(category)
  ])
}
