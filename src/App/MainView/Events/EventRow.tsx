import React, { useState } from "react";
import ms from "ms";
import { Popover } from "react-tiny-popover";
import { color as makeColor } from "@theorem/react";
import { soonDuration, Event } from "src/model";
import { useDimmedCalendars, useHiddenCalendars } from "src/userSettings";

type Props = {
  event: Event;
  now: number;
};

const clamp = (min: number, max: number, num: number) =>
  Math.max(Math.min(num, max), min);

export function EventRow(props: Props) {
  const { event, now } = props;
  const [menuVisible, setMenuVisible] = useState(false);
  const { dimCalendar, isCalendarDimmed, undimCalendar } = useDimmedCalendars();
  const { hideCalendar } = useHiddenCalendars();

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
    <div
      className={`event ${isCalendarDimmed(event.calendarId) ? "dimmed" : ""}`}
      style={{ color, fontSize }}
    >
      <Popover
        content={
          <div className="actions">
            <button
              onClick={() => {
                setMenuVisible(false);
                isCalendarDimmed(event.calendarId)
                  ? undimCalendar(event.calendarId)
                  : dimCalendar(event.calendarId);
              }}
            >
              {isCalendarDimmed(event.calendarId)
                ? "Undim calendar"
                : "Dim calendar"}
            </button>
            <button
              onClick={() => {
                setMenuVisible(false);
                hideCalendar(event.calendarId);
              }}
            >
              Hide calendar
            </button>
          </div>
        }
        isOpen={menuVisible}
        onClickOutside={() => setMenuVisible(false)}
        {...{ transitionDuration: 0 }}
      >
        <button className="title" onClick={() => setMenuVisible(true)}>
          {event.title}
        </button>
      </Popover>
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
