import * as Html from "@/display/markup"
import { LearningAreaCategory } from "./overview/learningAreaCategory"

export function bannerText(): Html.ViewAttribute {
  return Html.cssClasses([
    "font-bold",
    darkTextColor,
    "text-8xl"
  ])
}

export function tag(color: Colors): Html.ViewAttribute {
  return Html.cssClasses([
    backgroundColor(color),
    "rounded",
    "capitalize",
    "font-bold",
    lightTextColor,
    "py-2",
    "px-4",
    "border-2",
    "border-solid",
    borderColor(color),
  ])
}

export function link(): Html.ViewAttribute {
  return Html.cssClasses([
    "mt-8",
    "mx-16",
    "px-4",
    "py-2",
    "rounded",
    "border-cyan-800",
    "border-2",
    "border-dotted",
    "text-cyan-800",
    "font-bold",
    "inline-block"
  ])
}

export enum Colors {
  Standard = "standard",
  Discipline = "discipline",
  Team = "team",
  Theory = "theory"
}

export const darkTextColor = "text-sky-800"
export const lightTextColor = "text-neutral-50"

function backgroundColor(color: Colors): string {
  switch (color) {
    case Colors.Standard:
      return "bg-sky-800"
    case Colors.Discipline:
      return "bg-fuchsia-500"
    case Colors.Team:
      return "bg-purple-700"
    case Colors.Theory:
      return "bg-indigo-600"
  }
}

function borderColor(color: Colors): string {
  switch (color) {
    case Colors.Standard:
      return "border-sky-800"
    case Colors.Discipline:
      return "border-fuchsia-500"
    case Colors.Team:
      return "border-purple-700"
    case Colors.Theory:
      return "border-indigo-600"
  }
}

export function colorForCategory(category: LearningAreaCategory): Colors {
  switch (category) {
    case LearningAreaCategory.Discipline:
      return Colors.Discipline
    case LearningAreaCategory.Team:
      return Colors.Team
    case LearningAreaCategory.Theory:
      return Colors.Theory
  }
}