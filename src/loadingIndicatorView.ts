import * as Html from "../display/markup";

export function loadingIndicatorView(): Html.View {
  return Html.div([ Html.id("loading-indicator") ], [
    Html.text("Loading ...")
  ])
}