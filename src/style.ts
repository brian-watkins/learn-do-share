import * as Html from "loop/display"
import { LearningAreaCategory } from "./overview/learningAreaCategory.js"

export function bannerText(): Html.ViewAttribute {
  return Html.cssClasses([
    "font-bold",
    darkTextColor,
    "text-8xl"
  ])
}

export function tag(color: Colors, textColor: string = lightTextColor): Html.ViewAttribute {
  return Html.cssClasses([
    backgroundColor(color),
    "rounded",
    "capitalize",
    "font-bold",
    textColor,
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
    "border-dotted"
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
    "inline-block",
    "hover:underline"
  ])
}

export enum Colors {
  Dark = "standard",
  Light = "light",
  Discipline = "discipline",
  Team = "team",
  Theory = "theory",
  Engagement = "engagement"
}

export const darkTextColor = "text-slate-700"
export const lightTextColor = "text-neutral-50"
export const mediumTextColor = "text-slate-300"

export function backgroundColor(color: Colors): string {
  switch (color) {
    case Colors.Dark:
      return "bg-slate-700"
    case Colors.Light:
      return "bg-slate-100"
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
    case Colors.Light:
      return "border-slate-100"
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

export function focusWithinBorderColor(color: Colors): string {
  switch (color) {
    case Colors.Dark:
      return "focus-within:border-slate-700"
    case Colors.Light:
      return "focus-within:border-slate-100"
    case Colors.Discipline:
      return "focus-within:border-fuchsia-500"
    case Colors.Team:
      return "focus-within:border-purple-700"
    case Colors.Theory:
      return "focus-within:border-indigo-600"
    case Colors.Engagement:
      return "focus-within:border-sky-600"
  }
}

export function textColor(color: Colors): string {
  switch (color) {
    case Colors.Dark:
      return "text-slate-700"
    case Colors.Light:
      return "text-slate-100"
    case Colors.Discipline:
      return "text-fuchsia-500"
    case Colors.Team:
      return "text-purple-700"
    case Colors.Theory:
      return "text-indigo-600"
    case Colors.Engagement:
      return "text-sky-600"
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