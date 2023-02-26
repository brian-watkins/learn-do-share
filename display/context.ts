import { h, VNode } from "snabbdom"
import { BATCH_MESSAGE_TYPE } from "./batch.js"
import { View } from "./markup.js"

export type ViewGenerator<T> = (state: T, setState: (value: T) => DisplayContextMessage) => View

export interface ContextOptions<T> {
  initialState: T
  key?: string
}

// Why do I need to actually store the state here?
// Why not just use the message to generate the view? so it's just the message that
// has the state and it's not stored in the model? I guess because the message
// is only encountered as it bubbles up and so we store the data it contains then
// it goes through redux and triggers an update and we read the data off the vnode to
// render it again.

export function context<T>(options: ContextOptions<T>, generator: ViewGenerator<T>): View {
  return h("display-context", {
    attrs: {
      key: options.key ?? "__key"
    },
    displayContext: {},
    on: {
      displayMessage: function (evt: CustomEvent, vnode: VNode) {
        const contextMessage = getContextMessage(evt.detail)
        if (contextMessage !== undefined) {
          storeState(vnode, contextMessage.data)
        }
      }
    },
    hook: {
      init: (vNode) => {
        updateContext(vNode, generator, options.initialState)
      },
      prepatch: (oldVNode, vNode) => {
        const state: T = getState(oldVNode, getKey(vNode)) ?? options.initialState
        updateContext(vNode, generator, state)
      }
    }
  })
}

function updateContext<T>(vNode: VNode, generator: ViewGenerator<T>, state: T) {
  storeState(vNode, state)
  updateView(vNode, generateView(generator, state))
}

function storeState<T>(vNode: VNode, state: T) {
  vNode.data!.displayContext[getKey(vNode)] = state
}

function getState<T>(vNode: VNode, key: string): T | undefined {
  return vNode.data!.displayContext[key]
}

function getKey(vNode: VNode): string {
  return vNode.data!.attrs!.key as string
}

function updateView(vNode: VNode, view: VNode) {
  vNode.children = [view]
}

function generateView<T>(generator: ViewGenerator<T>, state: T): VNode {
  return generator(state, (updatedState: T) => {
    return displayContextMessage(updatedState)
  })
}

const DisplayContextMessageType = "__display_contextMessage"

interface DisplayContextMessage {
  type: typeof DisplayContextMessageType
  data: any
}

function displayContextMessage(data: any): DisplayContextMessage {
  return {
    type: DisplayContextMessageType,
    data
  }
}

function getContextMessage(message: any): DisplayContextMessage | undefined {
  if (message.type === DisplayContextMessageType) {
    return message
  } else if (message.type === BATCH_MESSAGE_TYPE) {
    for (const child of message.children) {
      const contextMessage = getContextMessage(child)
      if (contextMessage !== undefined) {
        return contextMessage
      }
    }
  }
  return undefined
}
