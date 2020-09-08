import ms from "ms";
import React from "react";
import { Calendar, filterEvents } from "src/model";
import { wordyClock } from "./wordyClock";
import { Events } from "./Events";

type Props = {
  calendar: Calendar;
  now: number;
  seed: string;
};

export function MainView(props: Props) {
  const { calendar, now, seed } = props;
  const hour = new Date(now).getHours();
  const minute = new Date(now).getMinutes();

  const clock = <div className="clock">{wordyClock(seed, hour, minute)}</div>;

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
    </div>
  );
}
