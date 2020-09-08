import React from "react";
import { useRerenderEvery } from "@theorem/react";
import ms from "ms";
import { useCalendar } from "./calendar";
import { dummyCalendar, dummyTime } from "./dummy";
import { MainView } from "./MainView";

export function App() {
  useRerenderEvery(ms("10s"));

  const now = dummyTime() || Date.now();
  const calendar = dummyTime() ? dummyCalendar() : useCalendar();
  const seed = String(Math.round(now / ms("1d")));

  return <MainView calendar={calendar} now={now} seed={seed} />;
}
