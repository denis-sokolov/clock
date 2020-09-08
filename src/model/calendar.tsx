import { Event } from "./events";

export type Calendar =
  | "not-inited"
  | {
      auth: "logged-out";
      login: () => void;
    }
  | {
      auth: "logged-in";
      events: "loading" | Event[];
      logout: () => void;
    };
