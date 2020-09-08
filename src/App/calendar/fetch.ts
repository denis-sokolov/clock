import { Event } from "src/model";

export async function fetchEvents(gapi: typeof window.gapi) {
  const calendars = (await gapi.client.calendar.calendarList.list()).result
    .items;

  const allEvents: Event[] = (
    await Promise.all(
      calendars.map(async (calendar) =>
        (
          await gapi.client.calendar.events.list({
            calendarId: calendar.id,
            timeMin: new Date().toISOString(),
            timeMax: new Date(Date.now() + 172800000).toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: "startTime",
          })
        ).result.items.map(
          (event): Event => {
            const start = Date.parse(
              event.start.dateTime || event.start.date || "1970-01-01"
            );
            const end = Date.parse(
              event.end.dateTime || event.end.date || "1970-01-01"
            );
            return {
              color: calendar.backgroundColor || "white",
              start,
              end,
              title: event.summary || "",
            };
          }
        )
      )
    )
  ).flat();

  allEvents.sort(function (a, b) {
    const aDate = a.start === "none" ? -Infinity : a.start;
    const bDate = b.start === "none" ? -Infinity : b.start;
    return aDate - bDate;
  });
  return allEvents;
}
