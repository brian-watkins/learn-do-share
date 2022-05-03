import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import { EffectHandler, effectMiddleware } from "./effect"
import display from "../src/app"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"
import { createReducer } from "./display"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: import.meta.env.VITE_APP_INSIGHTS_CONNECTION_STRING,
  disableTelemetry: import.meta.env.DEV,
  disableFetchTracking: false,
  enableCorsCorrelation: true,
  enableRequestHeaderTracking: true,
  enableResponseHeaderTracking: true,
} });
appInsights.loadAppInsights();
appInsights.addTelemetryInitializer(function (envelope) {
  envelope.tags!["ai.cloud.role"] = "display";
});
appInsights.trackPageView();

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
  handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
  return handlers
}

const store = createStore(createReducer(display), applyMiddleware(effectMiddleware(effectHandlers())))

const patch = init([
  propsModule,
  attributesModule,
  classModule,
  eventListenersModule
])

const appRoot = document.getElementById("app")

if (appRoot) {
  document.body.addEventListener("displayMessage", (evt) => {
    const displayMessageEvent = evt as CustomEvent<any>
    store.dispatch(displayMessageEvent.detail)
  })

  window.addEventListener("pageshow", (evt) => {
    if (evt.persisted) {
      console.log("Showing the page!")
      store.dispatch({ type: "refresh-state" } as any)
    } else {
      console.log("Showing the page but not persisted!")
    }
  })

  let oldNode: Element | VNode = appRoot
  const handleUpdate = () => {
    oldNode = patch(oldNode, display.view(store.getState()))
  }
  store.subscribe(handleUpdate)

  // here I would want to also subscribe, call getState() and write to session storage

  handleUpdate()
}
