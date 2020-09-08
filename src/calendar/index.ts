// Create keys in https://developers.google.com/calendar/quickstart/js
const clientId =
  "367448447306-e3nca3t8ucic6hnntm3frjp7f5n8ppus.apps.googleusercontent.com";
const apiKey = "AIzaSyC6urMKR7yjBnVqzZA5asFxX_W4vKyd8IA";

export async function getCalendarEvents() {}

const changeListeners = [] as (() => void)[];
export function onChange(f: () => void) {
  changeListeners.push(f);
}
const triggerChange = () => changeListeners.forEach((f) => f());

const gapi = () => window.gapi;

let initDone = false;
export function googleAuthState() {
  if (!initDone || gapi() === undefined) return "not-inited";
  if (gapi().auth2.getAuthInstance().isSignedIn.get()) return "logged-in";
  return "logged-out";
}

export const triggerLogin = () => gapi().auth2.getAuthInstance().signIn();
export const triggerLogout = () => gapi().auth2.getAuthInstance().signOut();

export function initCalendar() {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = function () {
    gapi().load("client:auth2", async function initClient() {
      await gapi().client.init({
        apiKey,
        clientId,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
        scope: ["https://www.googleapis.com/auth/calendar.readonly"].join(" "),
      });

      initDone = true;
      triggerChange();
      gapi().auth2.getAuthInstance().isSignedIn.listen(triggerChange);
    });
  };
  document.body.appendChild(script);
}

export type Event = {
  color: string;
  end: number | "none";
  start: number | "none";
  title: string;
};

let calendarState: "not-inited" | "loading" | Event[] = "not-inited";
onChange(async function () {
  const auth = googleAuthState();
  if (auth !== "logged-in") {
    if (calendarState !== "not-inited") {
      calendarState = "not-inited";
      triggerChange();
    }
    return;
  }
  if (calendarState !== "not-inited") return;

  calendarState = "loading";
  triggerChange();
  const calendars = (await gapi().client.calendar.calendarList.list()).result
    .items;

  const allEvents: Event[] = (
    await Promise.all(
      calendars.map(async (calendar) =>
        (
          await gapi().client.calendar.events.list({
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
  if (calendarState !== "loading") return;
  calendarState = allEvents;
  triggerChange();
  return;
});
export const getSortedEvents = () => calendarState;
