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

export function box(): Html.ViewAttribute {
  return Html.cssClasses([
    "p-8",
    "rounded",
    "border-2",
    borderColor(Colors.Dark),
    "border-dotted",
  ])
}

export function link(): Html.ViewAttribute {
  return Html.cssClasses([
    "px-4",
    "py-2",
    "rounded",
    borderColor(Colors.Dark),
    "border-2",
    "border-dotted",
    darkTextColor,
    "font-bold",
    "inline-block"
  ])
}

export enum Colors {
  Dark = "standard",
  Discipline = "discipline",
  Team = "team",
  Theory = "theory",
  Engagement = "engagement"
}

export const darkTextColor = "text-gray-900"
export const lightTextColor = "text-neutral-50"

function backgroundColor(color: Colors): string {
  switch (color) {
    case Colors.Dark:
      return "bg-slate-700"
    case Colors.Discipline:
      return "bg-fuchsia-500"
    case Colors.Team:
      return "bg-purple-700"
    case Colors.Theory:
      return "bg-indigo-600"
    case Colors.Engagement:
      return "bg-sky-600"
  }
}

export function borderColor(color: Colors): string {
  switch (color) {
    case Colors.Dark:
      return "border-slate-700"
    case Colors.Discipline:
      return "border-fuchsia-500"
    case Colors.Team:
      return "border-purple-700"
    case Colors.Theory:
      return "border-indigo-600"
    case Colors.Engagement:
      return "border-sky-600"
  }
}

export function colorForCategory(category: string): Colors {
  switch (category) {
    case LearningAreaCategory.Discipline:
      return Colors.Discipline
    case LearningAreaCategory.Team:
      return Colors.Team
    case LearningAreaCategory.Theory:
      return Colors.Theory
    default:
      return Colors.Dark
  }
}