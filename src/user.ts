import { User } from "@/api/common/user.js"
import { linkBox } from "./viewElements.js"
import * as Html from "loop/display"

export function userAccountView(user: User): Html.View {
  return linkBox("", user.name)
}
