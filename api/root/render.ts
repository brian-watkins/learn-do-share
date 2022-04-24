import { Backstage } from "../backstage/backstage"
import { User } from "../common/user"

export async function renderTemplate<T, M>(backstage: Backstage<T, M>, template: string, user: User | null): Promise<string> {
  const state = await backstage.initialState(user)

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  return template.replace("/* DISPLAY_INITIAL_STATE */", content)
}