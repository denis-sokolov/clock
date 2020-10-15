import ms from "ms";
import React from "react";
import { clean, Event } from "src/model";
import { useHiddenCalendars } from "src/userSettings";
import { EventRow } from "./EventRow";
import { Interval } from "./Interval";

type Props = {
  events: Event[];
  spacing?: boolean | { start?: number };
  now: number;
};

export function Events(props: Props) {
  const { now } = props;
  const { isCalendarHidden } = useHiddenCalendars();

  const events = clean(
    props.events.filter((event) => !isCalendarHidden(event.calendarId))
  );
  const spacing = props.spacing === true ? {} : props.spacing;

  if (!spacing)
    return (
      <div>
        {events.map((event) => (
          <EventRow event={event} key={event.id} now={now} />
        ))}
      </div>
    );

  const start = spacing.start || events[0]?.start;
  const max = (ns: number[]) => Math.max.apply(Math, ns);

  return (
    <div>
      {events.map(function (event, i) {
        const prevEnd = max(
          events
            .slice(0, i)
            .map((e) => {
              if (e.end === "none") return 0;
              if (e.start !== "none" && e.end - e.start > ms("23h"))
                return e.start;
              return e.end;
            })
            .concat([start === "none" ? 0 : start])
        );
        const ourStart = event.start;
        if (ourStart === "none")
          throw new Error(
            "Did not expect to render an event with not start date"
          );

        return (
          <div key={event.id}>
            {event.start !== "none" && (
              <Interval start={prevEnd} end={event.start} />
            )}
            <EventRow event={event} now={now} />
          </div>
        );
      })}
    </div>
  );
}
