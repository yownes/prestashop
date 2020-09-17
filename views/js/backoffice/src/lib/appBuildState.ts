import { App, BuildState } from "../models/App";

export function getAppBuildState(app: App): BuildState {
  return app.builds?.[app.builds.length - 1].state ?? BuildState.STALLED;
}
