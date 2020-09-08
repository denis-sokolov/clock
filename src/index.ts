import { wordyClock } from "./words";

function $(selector: string, f: (el: HTMLElement) => void) {
  document.querySelectorAll<HTMLElement>(selector).forEach(f);
}

function render() {
  const now = new Date();
  const seed = Math.round(now.getTime() / 1000 / 86400);
  const hour = now.getHours();
  const minute = now.getMinutes();
  $(".clock", (el) => (el.innerText = wordyClock(String(seed), hour, minute)));
}

render();
$(".layout", (el) => (el.style.opacity = "1"));
setInterval(render, 10000);
