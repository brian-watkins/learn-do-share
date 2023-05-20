import * as Html from "display-party"
import { learningArea } from "./learningArea.js"
import { GetState } from "state-party"

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

