import {
  googleAuthState,
  initCalendar,
  onChange,
  triggerLogin,
  triggerLogout,
} from "./calendar";
import { renderEvents } from "./renderEvents";
import { wordyClock } from "./words";

const $ = (selector: string, f: (el: HTMLElement) => void) =>
  document.querySelectorAll<HTMLElement>(selector).forEach(f);

function render() {
  const now = new Date();
  const seed = Math.round(now.getTime() / 1000 / 86400);
  const hour = now.getHours();
  const minute = now.getMinutes();
  $(".clock", (el) => (el.innerText = wordyClock(String(seed), hour, minute)));
  $("[data-logged-in]", (el) => {
    el.hidden = googleAuthState() !== "logged-in";
  });
  $("[data-logged-out]", (el) => {
    el.hidden = googleAuthState() !== "logged-out";
  });
  renderEvents();
}

render();
$(".layout", (el) => (el.style.opacity = "1"));
setInterval(render, 10000);

initCalendar();
$(".add-calendar", (el) => el.addEventListener("click", triggerLogin));
$(".logout", (el) => el.addEventListener("click", triggerLogout));
onChange(render);
