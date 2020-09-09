import React from "react";
import ms from "ms";
import { clean, Event } from "src/model";
import { EventRow } from "./EventRow";

type Props = {
  events: Event[];
  spacing?: boolean | { start?: number };
  now: number;
};

export function Events(props: Props) {
  const { now } = props;

  const events = clean(props.events);
  const spacing = props.spacing === true ? {} : props.spacing;

  if (!spacing)
    return (
      <div>
        {clean(events).map((event) => (
          <EventRow event={event} key={event.start + event.title} now={now} />
        ))}
      </div>
    );

  const start = spacing.start || events[0]?.start;

  return (
    <div>
      {events.map(function (event, i) {
        const prevEnd = i === 0 ? start : events[i - 1].end;
        const ourStart = event.start;
        if (ourStart === "none")
          throw new Error(
            "Did not expect to render an event with not start date"
          );
        const pauseSinceStart =
          prevEnd === "none"
            ? 0
            : Math.min(ms("5h"), Math.max(0, ourStart - prevEnd));
        return (
          <div
            key={event.start + event.title}
            style={{ paddingTop: msToPx(pauseSinceStart) }}
          >
            <EventRow event={event} now={now} />
          </div>
        );
      })}
    </div>
  );
}

function msToPx(ms: number) {
  return ms / 36000;
}
