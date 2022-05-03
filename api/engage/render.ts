import { Backstage } from "../backstage/backstage"
import { User } from "../common/user"

export interface EngageContext {
  learningAreaId: string
}

export async function renderTemplate<T, M>(backstage: Backstage<EngageContext, T, M>, template: string, user: User | null, learningAreaId: string): Promise<string> {
  const state = await backstage.initialState({
    user,
    attributes: {
      learningAreaId
    }
  })

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  return template.replace("/* DISPLAY_INITIAL_STATE */", content)
}