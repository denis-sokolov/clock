import ms from "ms";
import { Calendar, Event } from "src/model";

function event(title: string, time: string): Event {
  const { start, end } = (function () {
    const mRoot = time.match(/^(.+)-(.+)$/);
    if (!mRoot) throw new Error("Dummy time is invalid");
    function parse(s: string) {
      if (s === "none") return "none" as const;
      if (s === "yesterday") return Date.now() - ms("1d");
      const m = s.match(/^(\d?\d):(\d\d)$/);
      if (!m) throw new Error("Dummy time is invalid");
      const d1 = new Date();
      d1.setHours(Number(m[1]));
      d1.setMinutes(Number(m[2]));
      return d1.getTime();
    }
    return { start: parse(mRoot[1]), end: parse(mRoot[2]) };
  })();
  return {
    calendarId: "1",
    color: "green",
    end,
    id: title + time,
    start,
    title,
  };
}

export function dummyCalendar(): Calendar {
  return {
    auth: "logged-in",
    events: [
      event("Forever", "none-none"),
      event("Bring your child to work day", "yesterday-none"),
      event("Breakfast at Tiffany’s", "10:00-11:00"),
      event("Rest", "11:00-11:20"),
      event("Lunch", "13:00-13:25"),
      event(
        "A meeting with somebody involving reading a book with a fantastically long title",
        "15:00-15:35"
      ),
      event("Dinner", "19:00-20:30"),
      event("Dinner notes", "19:05-19:05"),
      event("Conversation", "19:35-21:35"),
    ],
    logout: () => {},
  };
}
