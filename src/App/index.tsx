import React from "react";
import { useRerenderEvery } from "@theorem/react";
import ms from "ms";
import { useCalendar } from "./calendar";
import { MainView } from "./MainView";

export function App() {
  useRerenderEvery(ms("10s"));

  const calendar = useCalendar();
  const now = Date.now();
  const seed = String(Math.round(now / ms("1d")));

  return <MainView calendar={calendar} now={now} seed={seed} />;
}
