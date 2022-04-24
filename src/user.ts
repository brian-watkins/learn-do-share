import { User } from "../api/common/user"
import * as Html from "../display/markup"

export function loginView(): Html.View {
  return Html.div([], [
    Html.a([Html.href("/login")], [Html.text("Login")]),
  ])
}

export function userAccountView(user: User): Html.View {
  return Html.div([], [
    Html.div([], [Html.text(user.name)])
  ])
}