import ms from "ms";

export type Event = {
  color: string;
  end: number | "none";
  start: number | "none";
  title: string;
};

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

function similarTitles(a: string, b: string): boolean {
  const clean = (t: string) => t.replace(/[\s.,;'[]!@#$%^&*\(\)_-]/g, "");
  return clean(a) === clean(b);
}

export function clean(events: Event[]): Event[] {
  const result: Event[] = [];
  events.forEach(function (ev) {
    const title = (ev.title || "").trim();
    if (!title) return;

    const similarExists = result.some(
      (e) => similarTitles(e.title, ev.title) && e.start === ev.start
    );
    if (similarExists) return;

    result.push(ev);
  });
  return result;
}
