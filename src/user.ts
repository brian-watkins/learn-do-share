import { User } from "@/api/common/user"
import * as Html from "@/display/markup"
import { linkStyles } from "./viewElements"

export function loginView(): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "justify-end",
      "mb-8"
    ])
  ], [
    Html.a([linkStyles(), Html.href("/login")], [Html.text("Login")]),
  ])
}

export function userAccountView(user: User): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "justify-end",
      "mb-8"
    ])
  ], [
    Html.button([linkStyles()], [
      Html.text(user.name)
    ])
  ])
}
