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

export function userAccountView(user: User | null): Html.View {
  if (user === null) {
    return Html.div([], [
      Html.a([Html.href("/.auth/login/github")], [Html.text("Login")]),
    ])
  } else {
    return Html.div([], [
      Html.div([], [Html.text(user.identifier)])
    ])
  }
}