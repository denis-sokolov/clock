import { useLocalStorageArray } from "src/useLocalStorage";

export function useHiddenCalendars() {
  const [calendarIds, setCalendarIds] = useLocalStorageArray<string>(
    "hidden-calendar-ids"
  );
  return {
    hideCalendar: (id: string) =>
      setCalendarIds((prev) => (prev.includes(id) ? prev : prev.concat([id]))),
    isCalendarHidden: (id: string) => calendarIds.includes(id),
    restoreHiddenCalendars: () => setCalendarIds([]),
    someCalendarsHidden: () => calendarIds.length > 0,
  };
}
