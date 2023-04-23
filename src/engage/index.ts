import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { init } from "./storage.js"
import { createDisplay } from 'loop/display';

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
appInsights.trackPageView({ name: "engage" });

init(window._display_initial_state)

if (window._display_initial_state.type === "personalized") {
  const display = createDisplay()
  import("./engagementNotes/view.js").then((engagementNotesModule) => {
    display.mount(document.getElementById("engagement-notes")!, engagementNotesModule.default)
  })
  import("./engagementPlans/view.js").then((engagementPlansModule) => {
    display.mount(document.getElementById("engagement-plans")!, engagementPlansModule.default)
  })
}
