import * as Html from "../display/markup"

export interface User {
  identifier: string
}

export function toUser(identifier: string | null): User | null {
  if (identifier === null) {
    return null
  }

  return { identifier }
}

export function loginView(): Html.View {
  return Html.div([], [
    Html.a([Html.href("/login")], [Html.text("Login")]),
  ])
}

export function userAccountView(user: User): Html.View {
  return Html.div([], [
    Html.div([], [Html.text(user.identifier)])
  ])
}