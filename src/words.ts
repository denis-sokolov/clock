function hourWord(seed: string, hour: number) {
  const numberWords = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
  ];
  function word() {
    if (hour === 0) return random(seed, "h", ["Midnight", "Twelve"]);
    if (hour === 12) return random(seed, "h", ["Midday", "Twelve"]);
    return numberWords[hour % 12];
  }
  const H = word();
  return {
    H,
    h: H.toLocaleLowerCase(),
    isNumberWord: numberWords.includes(H),
  };
}

import seedrandom from "seedrandom";

function random<T>(seedBase: string, seedSuffix: string, list: T[]): T {
  const seed = seedBase + seedSuffix;
  const random = seedrandom(seed)();
  const index = Math.floor(random * list.length);
  return list[index];
}

function onTheHour(seed: string, hour: number) {
  const { H } = hourWord(seed, hour);
  return H;
}

function almostOnTheHour(seed: string, hour: number) {
  const { H, h } = hourWord(seed, hour);
  return random(seed, "almostOnTheHour", [
    `${H}-ish`,
    `${H} or so`,
    `About ${h}`,
    `Around ${h}`,
  ]);
}

function quarterAfter(seed: string, hour: number) {
  const { h } = hourWord(seed, hour);
  return random(seed, "quarterAfter", [`After ${h}`, `A quarter past ${h}`]);
}

function quarterTo(seed: string, hour: number) {
  const { h } = hourWord(seed, hour);
  return random(seed, "quarterTo", [
    `Almost ${h}`,
    `Approaching ${h}`,
    `About quarter to ${h}`,
    `Quarter to ${h}`,
    `Fifteen to ${h}`,
  ]);
}

function almostHalfPast(seed: string, hour: number) {
  return random(seed, "almostHalfPast", [
    `About ${halfPast(seed, hour).toLowerCase()}`,
    `Almost ${halfPast(seed, hour).toLowerCase()}`,
  ]);
}

function afterHalfPast(seed: string, hour: number) {
  return random(seed, "afterHalfPast", [
    `About ${halfPast(seed, hour).toLowerCase()}`,
  ]);
}

function halfPast(seed: string, hour: number) {
  const { H, h, isNumberWord } = hourWord(seed, hour);
  return random(
    seed,
    "halfPast",
    [`Half past ${h}`].concat(isNumberWord ? [`${H} thirty`] : [])
  );
}

export function wordyClock(seed: string, hour: number, minute: number): string {
  if (minute < 3) return onTheHour(seed, hour);
  if (minute < 10) return almostOnTheHour(seed, hour);
  if (minute < 20) return quarterAfter(seed, hour);
  if (minute < 25) return almostHalfPast(seed, hour);
  if (minute < 35) return halfPast(seed, hour);
  const nextHour = (hour + 1) % 24;
  if (minute < 40) return afterHalfPast(seed, hour);
  if (minute < 50) return quarterTo(seed, nextHour);
  if (minute < 57) return almostOnTheHour(seed, nextHour);
  return onTheHour(seed, nextHour);
}
