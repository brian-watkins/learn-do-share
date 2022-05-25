import { User } from "@/api/common/user"
import * as Html from "@/display/markup"
import { linkBox } from "./viewElements"

export function loginView(): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "justify-end",
      "mb-8"
    ])
  ], [
    linkBox("/login", "Login")
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
    linkBox("", user.name)
  ])
}
