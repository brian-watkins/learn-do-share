import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import { EffectHandler, effectMiddleware } from "../../display/effect"
import display from "./display"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "../../display/backstage"
import { AppDisplay, createReducer } from "../../display/display"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "../../display/batch"
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { SESSION_MESSAGE_TYPE } from "../../display/session"

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APP_INSIGHTS_CONNECTION_STRING,
    disableTelemetry: import.meta.env.DEV,
    disablePageUnloadEvents: ["beforeUnload", "unload"], // required for bfcache on chrome
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});
appInsights.loadAppInsights();
appInsights.addTelemetryInitializer(function (envelope) {
  envelope.tags!["ai.cloud.role"] = "display";
});
appInsights.trackPageView();

const app = new AppDisplay("#app", display)
app.start()

// function effectHandlers(): Map<string, EffectHandler> {
//   const handlers = new Map<string, EffectHandler>()
//   handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
//   handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
//   handlers.set(SESSION_MESSAGE_TYPE, handleSessionMessage)
//   return handlers
// }

// const store = createStore(createReducer(display), applyMiddleware(effectMiddleware(effectHandlers())))

// const patch = init([
//   propsModule,
//   attributesModule,
//   classModule,
//   eventListenersModule
// ])

// const appRoot = document.getElementById("app")

// if (appRoot) {
//   document.body.addEventListener("displayMessage", (evt) => {
//     const displayMessageEvent = evt as CustomEvent<any>
//     store.dispatch(displayMessageEvent.detail)
//   })

//   let oldNode: Element | VNode = appRoot
//   const handleUpdate = () => {
//     oldNode = patch(oldNode, display.view(store.getState()))
//   }
//   store.subscribe(handleUpdate)

//   if (display.subscription) {
//     store.subscribe(() => {
//       display.subscription?.(store.getState(), store.dispatch)
//     })
//   }

//   handleUpdate()
// }
