import ms from "ms";
import { color } from "@theorem/react";
import { getSortedEvents } from "../calendar";
import { clean } from "./clean";
import { eventsByTime, longDuration, soonDuration, Event } from "./model";

const clamp = (min: number, max: number, num: number) =>
  Math.max(Math.min(num, max), min);

const $ = (selector: string, f: (el: HTMLElement) => void) =>
  document.querySelectorAll<HTMLElement>(selector).forEach(f);

function eventDiv(now: number, event: Event, div: HTMLElement) {
  const distanceInMs =
    event.start === "none" ? Infinity : Math.abs(now - event.start);

  div.classList.add("event");

  const title = document.createElement("span");
  title.classList.add("title");
  title.innerText = event.title;
  div.appendChild(title);

  const time = document.createElement("span");
  time.classList.add("time");
  time.innerText = Math.ceil(distanceInMs / ms("1m")) + "m";
  time.hidden = distanceInMs > soonDuration;
  div.appendChild(time);

  const c = color(event.color);
  div.style.color = c
    .withSaturation(clamp(0, 30, c.saturation()))
    .withLightness(clamp(20, 50, c.lightness()))
    .hsl();

  const maxSize = 28;
  const minSize = 16;
  const fontSize =
    minSize +
    (maxSize - minSize) * (1 - clamp(0, 1, distanceInMs / soonDuration));
  div.style.fontSize = fontSize + "px";
}

function msToPx(ms: number) {
  return ms / 36000;
}

function collapsed(now: number, selector: string, events: Event[]) {
  $(selector, (el) => {
    el.innerHTML = "";
    clean(events).forEach(function (event) {
      const div = document.createElement("div");
      eventDiv(now, event, div);
      el.appendChild(div);
    });
  });
}

function spacedOut(
  now: number,
  selector: string,
  events: Event[],
  options: { start?: number; end?: number } = {}
) {
  const start = options.start || events[0]?.start;
  $(selector, (el) => {
    el.innerHTML = "";
    el.style.minHeight =
      options.start && options.end
        ? msToPx(options.end - options.start) + "px"
        : "0";
    const cleanEvents = clean(events);
    cleanEvents.forEach(function (event, i) {
      const prevEnd = i === 0 ? start : cleanEvents[i - 1].end;
      const ourStart = event.start;
      if (ourStart === "none")
        throw new Error(
          "Did not expect to render an event with not start date"
        );
      const pauseSinceStart =
        prevEnd === "none"
          ? 0
          : Math.min(ms("5h"), Math.max(0, ourStart - prevEnd));
      const div = document.createElement("div");
      div.style.paddingTop = msToPx(pauseSinceStart) + "px";
      eventDiv(now, event, div);
      el.appendChild(div);
    });
  });
}

export function renderEvents() {
  const all =
    ".clock, .current-long-events, .current-event, .next-events, .upcoming-events";
  const events = getSortedEvents();
  if (events === "not-inited") {
    $(all, (el) => (el.hidden = true));
    return;
  }
  if (events === "loading") {
    $(all, (el) => (el.hidden = true));
    $(".next-events", (el) => {
      el.hidden = false;
      el.innerText = "Loading events...";
    });
    return;
  }

  $(all, (el) => (el.hidden = false));

  const now = Date.now();

  const currentLongEvents = eventsByTime(events, {
    startBefore: now - longDuration,
  });
  const currentEvents = eventsByTime(events, {
    startAfter: now - longDuration,
    startBefore: now,
  });
  const nextEvents = eventsByTime(events, {
    startAfter: now,
  });

  collapsed(now, ".current-long-events", currentLongEvents);
  collapsed(now, ".current-events", currentEvents);
  spacedOut(now, ".next-events", nextEvents, {
    start: now,
  });
}
