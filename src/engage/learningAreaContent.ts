import * as Html from "loop/display"
import { learningArea } from "./learningArea.js"
import { GetState } from "loop"

export function learningAreaContentView(get: GetState): Html.View {
  const area = get(learningArea)
  return Html.div([
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

