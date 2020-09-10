import { useRerender } from "@theorem/react";
import { createNanoEvents } from "nanoevents";
import { useEffect } from "react";

const events = createNanoEvents();

function useMain<T>(
  key: string,
  options: {
    decode: (raw: string) => T;
    defaultValue: T;
    encode: (value: T) => string;
  }
) {
  const { decode, defaultValue, encode } = options;

  const rerender = useRerender();
  useEffect(() => events.on(key, rerender));

  function readAndDecode() {
    try {
      return decode(localStorage.getItem(key) || "");
    } catch (err) {
      return defaultValue;
    }
  }

  const value = readAndDecode();
  const setter = function (param: T | ((prev: T) => T)) {
    const newVal =
      typeof param === "function"
        ? // https://github.com/microsoft/TypeScript/issues/37663
          (param as (prev: T) => T)(readAndDecode())
        : param;
    localStorage.setItem(key, encode(newVal));
    events.emit(key);
  };

  return [value, setter] as const;
}

export function useLocalStorageArray<T>(key: string) {
  return useMain<T[]>(key, {
    decode: (x) => {
      const d = JSON.parse(x);
      return Array.isArray(d) ? d : [];
    },
    defaultValue: [],
    encode: (x) => JSON.stringify(x),
  });
}

export function useLocalStorageInt(key: string, defaultValue: number) {
  return useMain(key, {
    decode: (x) => parseInt(x, 10),
    defaultValue,
    encode: (x) => String(x),
  });
}

export function useLocalStorageString(key: string) {
  return useMain(key, {
    decode: (x) => x,
    defaultValue: "",
    encode: (x) => x,
  });
}
