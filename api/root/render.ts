import { Backstage } from "../backstage/backstage"

export async function renderTemplate<T, M>(backstage: Backstage<T, M>, template: string, userIdentifier: string | null): Promise<string> {
  const state = await backstage.initialState(userIdentifier)

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  return template.replace("/* DISPLAY_INITIAL_STATE */", content)
}