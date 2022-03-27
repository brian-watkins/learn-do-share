import * as Html from '../display/markup'

export function asListItem(node: Html.ViewChild): Html.ViewChild {
  return Html.li([], [node])
}
