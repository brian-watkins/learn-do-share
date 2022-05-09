import { Backstage, BackstageContext } from "../backstage/backstage"

export async function renderTemplate<C, T, M>(backstage: Backstage<C, T, M>, template: string, context: BackstageContext<C>): Promise<string> {
  const state = await backstage.initialState(context)

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  return template.replace("/* DISPLAY_INITIAL_STATE */", content)
}