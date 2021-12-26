import { Event } from "src/model";

export async function fetchEvents(
  gapi: typeof window.gapi,
  fromTimestamp: number,
  intervalInMs: number
) {
  const calendars = (await gapi.client.calendar.calendarList.list()).result
    .items;

  const allEvents: Event[] = (
    await Promise.all(
      calendars.map(async (calendar) => {
        return (
          await gapi.client.calendar.events.list({
            calendarId: calendar.id,
            timeMin: new Date(fromTimestamp).toISOString(),
            timeMax: new Date(fromTimestamp + intervalInMs).toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: "startTime",
          })
        ).result.items
          .filter((event) => {
            const myEmail = calendar.id;
            const meAttendee = event.attendees?.find(
              (attendee) => attendee.email === myEmail
            );
            if (!meAttendee) return true;
            if (meAttendee.responseStatus === "declined") return false;
            return true;
          })
          .map(
            (event): Event => {
              const start = event.start.dateTime
                ? Date.parse(event.start.dateTime)
                : event.start.date
                ? Date.parse(`${event.start.date}T00:00:00`)
                : "none";
              const end = event.end.dateTime
                ? Date.parse(event.end.dateTime)
                : event.end.date
                ? Date.parse(`${event.end.date}T23:59:59`)
                : "none";
              return {
                calendarId: calendar.id,
                color: calendar.backgroundColor || "white",
                id: event.id,
                start,
                end,
                title: event.summary || "",
              };
            }
          );
      })
    )
  ).flat();

  allEvents.sort(function (a, b) {
    const aDate = a.start === "none" ? -Infinity : a.start;
    const bDate = b.start === "none" ? -Infinity : b.start;
    return aDate - bDate;
  });
  return allEvents;
}
