// import * as Html from "@/display/markup"
import * as Html from "loop/display"
import { LearningArea } from "./learningArea.js"

export function learningAreaContentView(area: LearningArea): Html.View {
  return Html.p([
    Html.id("learning-area-content"),
    Html.cssClasses([
      "w-136",
      "ml-16",
      "mt-12",
      "pl-16",
      "text-xl"
    ]),
    Html.property("innerHTML", area.content)
  ], [])
}

