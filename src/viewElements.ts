import * as Html from "../display/markup"

export function cardView(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.article([cardStyle(), ...attributes], children)
}

function cardStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "m-4": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true }])
}
