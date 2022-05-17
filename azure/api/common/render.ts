import { User } from "./user"

export interface RenderContext<C> {
  user: User | null
  attributes: C
}

export interface OkResult<M> {
  type: "ok"
  state: M
}

export function okResult<M>(state: M): OkResult<M> {
  return {
    type: "ok",
    state
  }
}

export interface RedirectResult {
  type: "redirect"
  location: string
}

export function redirectResult(location: string): RedirectResult {
  return {
    type: "redirect",
    location
  }
}

export type InitialStateResult<M> = OkResult<M> | RedirectResult

export interface BackstageRenderer<C, M> {
  initialState(context: RenderContext<C>): Promise<InitialStateResult<M>>
}

export function renderTemplate(template: string, content: any): string {
  const jsContent = `window._display_initial_state = ${JSON.stringify(content)};`
  return template.replace("/* DISPLAY_INITIAL_STATE */", jsContent)
}