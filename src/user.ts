import { User } from "@/api/common/user"
import * as Html from "@/display/markup"

export function loginView(): Html.View {
  return Html.div([userStyle()], [
    Html.a([Html.href("/login")], [Html.text("Login")]),
  ])
}

export function userAccountView(user: User): Html.View {
  return Html.div([], [
    Html.div([userStyle()], [
      Html.text(user.name)
    ])
  ])
}

function userStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "p-4": true },
    { "text-right": true }
  ])
}