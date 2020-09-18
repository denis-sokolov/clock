import React from "react";
import { useRerenderEvery, ErrorBoundary } from "@theorem/react";
import ms from "ms";
import { useCalendar } from "./calendar";
import { CrashScreen } from "./CrashScreen";
import { dummyCalendar, dummyTime } from "./dummy";
import { MainView } from "./MainView";

export function App() {
  useRerenderEvery(ms("10s"));

  const now = dummyTime() || Date.now();
  const calendar = dummyTime() ? dummyCalendar() : useCalendar();
  const seed = String(Math.round(now / ms("1d")));

  return (
    <ErrorBoundary component={CrashScreen} reportError={() => {}}>
      <MainView calendar={calendar} now={now} seed={seed} />
    </ErrorBoundary>
  );
}
