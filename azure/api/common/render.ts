import { User } from "./user"

export interface RenderContext<C> {
  user: User | null
  attributes: C
}

export interface BackstageRenderer<C, M> {
  initialState(context: RenderContext<C>): Promise<M>
}

export async function renderTemplate<C, M>(renderer: BackstageRenderer<C, M>, template: string, context: RenderContext<C>): Promise<string> {
  const state = await renderer.initialState(context)

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  return template.replace("/* DISPLAY_INITIAL_STATE */", content)
}