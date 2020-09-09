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
  const startDistance =
    event.start === "none" ? Infinity : Math.abs(now - event.start);
  const endDistance =
    event.end === "none" ? Infinity : Math.abs(now - event.end);

  const c = makeColor(event.color);
  const color = c
    .withSaturation(clamp(0, 30, c.saturation()))
    .withLightness(clamp(20, 50, c.lightness()))
    .hsl();

  const maxSize = 28;
  const minSize = 16;
  const fontSize =
    minSize +
    (maxSize - minSize) * (1 - clamp(0, 1, startDistance / soonDuration));
  const timeFontSize = clamp(14, maxSize, fontSize / 2);

  const upcoming = event.start !== "none" && now < event.start;
  const current =
    event.start !== "none" &&
    event.start < now &&
    event.end !== "none" &&
    now < event.end;

  const nMoreMins =
    current && endDistance <= soonDuration
      ? Math.ceil(endDistance / ms("1m"))
      : undefined;
  const inNmins =
    upcoming && startDistance <= soonDuration
      ? Math.ceil(startDistance / ms("1m"))
      : undefined;

  return (
    <div className="event" style={{ color, fontSize }}>
      <span className="title">{event.title}</span>
      {nMoreMins && (
        <span className="time" style={{ fontSize: timeFontSize }}>
          {nMoreMins} more {nMoreMins === 1 ? "minute" : "minutes"}
        </span>
      )}
      {inNmins && (
        <span className="time" style={{ fontSize: timeFontSize }}>
          {inNmins < 5 && "in"} {inNmins}m
        </span>
      )}
    </div>
  );
}
