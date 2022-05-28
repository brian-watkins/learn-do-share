import { User } from "@/api/common/user"
import * as Html from "@/display/markup"
import { linkBox } from "./viewElements"

export function userAccountView(user: User): Html.View {
  return linkBox("", user.name)
}
