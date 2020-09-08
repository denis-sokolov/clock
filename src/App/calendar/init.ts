const clientId =
  "367448447306-e3nca3t8ucic6hnntm3frjp7f5n8ppus.apps.googleusercontent.com";
const apiKey = "AIzaSyC6urMKR7yjBnVqzZA5asFxX_W4vKyd8IA";

function addScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

async function gapiLoad(name: string): Promise<void> {
  return new Promise((resolve) => {
    gapi.load(name, resolve);
  });
}

export async function initCalendar() {
  await addScript("https://apis.google.com/js/api.js");
  await gapiLoad("client:auth2");
  await gapi.client.init({
    apiKey,
    clientId,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
    scope: ["https://www.googleapis.com/auth/calendar.readonly"].join(" "),
  });
}
