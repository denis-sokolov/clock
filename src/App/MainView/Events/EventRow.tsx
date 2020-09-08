import React from "react";
import ms from "ms";
import { color as makeColor } from "@theorem/react";
import { soonDuration, Event } from "src/model";

type Props = {
  event: Event;
  now: number;
};

const clamp = (min: number, max: number, num: number) =>
  Math.max(Math.min(num, max), min);

export function EventRow(props: Props) {
  const { event, now } = props;
  const distanceInMs =
    event.start === "none" ? Infinity : Math.abs(now - event.start);

  const c = makeColor(event.color);
  const color = c
    .withSaturation(clamp(0, 30, c.saturation()))
    .withLightness(clamp(20, 50, c.lightness()))
    .hsl();

  const maxSize = 28;
  const minSize = 16;
  const fontSize =
    minSize +
    (maxSize - minSize) * (1 - clamp(0, 1, distanceInMs / soonDuration));

  return (
    <div className="event" style={{ color, fontSize }}>
      <span className="title">{event.title}</span>
      {distanceInMs <= soonDuration && (
        <span className="time">{Math.ceil(distanceInMs / ms("1m")) + "m"}</span>
      )}
    </div>
  );
}
