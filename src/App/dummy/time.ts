const timeOverride = (function () {
  const param = new URLSearchParams(location.search).get("time") || "";
  const m = param.match(/^(\d?\d)[^\d]?(\d\d)$/);
  if (!m) return undefined;
  const d = new Date();
  d.setHours(Number(m[1]));
  d.setMinutes(Number(m[2]));
  return d.getTime();
})();

export const dummyTime = () => timeOverride;
