import React, { useEffect } from "react";
import { Calendar, filterEvents } from "src/model";
import { useHiddenCalendars } from "src/userSettings";
import { wordyClock } from "./wordyClock";
import { Events } from "./Events";

type Props = {
  calendar: Calendar;
  now: number;
  seed: string;
};

export function MainView(props: Props) {
  const { calendar, now, seed } = props;
  const { restoreHiddenCalendars, someCalendarsHidden } = useHiddenCalendars();
  const hour = new Date(now).getHours();
  const minute = new Date(now).getMinutes();

  const clockText = wordyClock(seed, hour, minute);
  useEffect(function () {
    const isApp =
      (window.navigator as any).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    // The app view does not benefit from the display in the tab title instead it duplicates the content
    document.title = isApp ? "" : clockText;
  });
  const clock = <div className="clock">{clockText}</div>;

  if (calendar === "not-inited") return null;
  if (calendar.auth === "logged-out")
    return (
      <div className="layout">
        {clock}
        <button className="add-calendar" onClick={calendar.login}>
          Add calendar
        </button>
      </div>
    );

  return (
    <div className="layout">
      <div className="above-the-fold">
        {calendar.events !== "loading" && (
          <div className="current-events">
            <Events
              events={filterEvents(calendar.events, {
                start: { before: now },
                end: { after: now, includeEmpty: true },
              })}
              now={now}
            />
          </div>
        )}
        {clock}
        {calendar.events === "loading" && <div>Loading events...</div>}
        {calendar.events !== "loading" && (
          <div className="next-events">
            <Events
              events={filterEvents(calendar.events, {
                start: { after: now },
              })}
              now={now}
              spacing={{
                start: now,
              }}
            />
          </div>
        )}
      </div>
      <button className="logout" onClick={calendar.logout}>
        Logout
      </button>
      {someCalendarsHidden() && (
        <button onClick={restoreHiddenCalendars}>Unhide calendars</button>
      )}
    </div>
  );
}
