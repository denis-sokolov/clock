import { Event } from "../calendar";
import ms from "ms";

export type { Event } from "../calendar";
export const longDuration = ms("3h");
export const soonDuration = ms("1h");

export function eventsByTime(
  events: Event[],
  opts: {
    startAfter?: number;
    startBefore?: number;
  }
) {
  const { startAfter, startBefore } = opts;
  return events.filter((e) => {
    if (e.start === "none") return !!startAfter;
    if (startAfter && e.start < startAfter) return false;
    if (startBefore && startBefore <= e.start) return false;
    return true;
  });
}
