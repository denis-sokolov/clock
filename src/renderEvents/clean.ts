import { Event } from "./model";

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
