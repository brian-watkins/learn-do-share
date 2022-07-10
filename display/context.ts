import { h, VNode } from "snabbdom"
import { BATCH_MESSAGE_TYPE } from "./batch"
import { View } from "./markup"

export type ViewGenerator<T> = (state: T, setState: (value: T) => DisplayContextMessage) => View

export function context<T>(initialState: T, generator: ViewGenerator<T>): View {
  return h("display-context", {
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
        updateContext(vNode, generator, initialState)
      },
      prepatch: (oldVNode, vNode) => {
        updateContext(vNode, generator, oldVNode.data?.displayContext)
      }
    }
  })
}

function updateContext<T>(vNode: VNode, generator: ViewGenerator<T>, state: T) {
  storeState(vNode, state)
  updateView(vNode, generateView(generator, state))
}

function storeState<T>(vNode: VNode, state: T) {
  vNode.data!.displayContext = state
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
