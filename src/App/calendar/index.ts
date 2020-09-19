import ms from "ms";
import { useState } from "react";
import { useRerender } from "@theorem/react";
import { Calendar, Event } from "src/model";
import { useAsyncEffect } from "src/useAsyncEffect";
import { initCalendar } from "./init";
import { fetchEvents } from "./fetch";

export function useCalendar(
  fromTimestamp: number,
  intervalInMs: number
): Calendar {
  const [initDone, setInitDone] = useState(false);
  const [events, setEvents] = useState<"no-auth" | "loading" | Event[]>(
    "no-auth"
  );
  const rerender = useRerender();

  const auth = (function () {
    if (!initDone || window.gapi === undefined) return "not-inited";
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) return "logged-in";
    return "logged-out";
  })();

  useAsyncEffect(async function () {
    await initCalendar();
    setInitDone(true);
    gapi.auth2.getAuthInstance().isSignedIn.listen(rerender);
  }, []);

  useAsyncEffect(
    async function ({ cancelled }) {
      if (auth === "logged-out") {
        setEvents("no-auth");
        return;
      }

      if (auth === "logged-in") {
        setEvents("loading");
        async function fetch() {
          const events = await fetchEvents(
            window.gapi,
            fromTimestamp,
            intervalInMs
          );
          if (cancelled()) return;
          setEvents(events);
          setTimeout(fetch, ms("10m"));
        }
        fetch();
      }
    },
    [auth]
  );

  if (auth === "not-inited") return "not-inited";
  if (auth === "logged-out")
    return {
      auth: "logged-out",
      login: () => gapi.auth2.getAuthInstance().signIn(),
    };

  if (events === "no-auth") {
    // Our effect did not catch up with the auth changes yet
    return {
      auth: "logged-in",
      events: "loading",
      logout: () => gapi.auth2.getAuthInstance().signOut(),
    };
  }

  return {
    auth: "logged-in",
    events,
    logout: () => gapi.auth2.getAuthInstance().signOut(),
  };
}
