import { User } from "@/api/common/user"
import * as Html from "@/display/markup"
import { linkStyles } from "./viewElements"

export function loginView(): Html.View {
  return Html.div([
    Html.cssClassList([
      { "flex": true },
      { "justify-end": true },
      { "mb-8": true }
    ])
  ], [
    Html.a([linkStyles(), Html.href("/login")], [Html.text("Login")]),
  ])
}

export function userAccountView(user: User): Html.View {
  return Html.div([
    Html.cssClassList([
      { "flex": true },
      { "justify-end": true },
      { "mb-8": true }
    ])
  ], [
    Html.button([linkStyles()], [
      Html.text(user.name)
    ])
  ])
}
