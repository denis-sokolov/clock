import ms from "ms";

export type Event = {
  calendarId: string;
  color: string;
  end: number | "none";
  id: string;
  start: number | "none";
  title: string;
};

export const longDuration = ms("3h");
export const soonDuration = ms("1h");

export function filterEvents(
  events: Event[],
  opts: {
    end?: {
      after?: number;
      before?: number;
      includeEmpty?: boolean;
    };
    start?: {
      after?: number;
      before?: number;
      includeEmpty?: boolean;
    };
  }
) {
  const { end, start } = opts;

  function passesRule(
    time: Event["start"],
    rule: typeof opts["start"]
  ): boolean {
    if (!rule) return true;
    if (time === "none") return Boolean(rule.includeEmpty);
    if (rule.after && time < rule.after) return false;
    if (rule.before && rule.before <= time) return false;
    return true;
  }

  return events.filter((e) => {
    if (!passesRule(e.start, start)) return false;
    if (!passesRule(e.end, end)) return false;
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
