import { baseURL, goodByeHacker, inputNameEl, inputTextEl } from "./main.js";

export function getFP() {
  return fetch(baseURL, {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
}

export function sendD() {
  return fetch(baseURL, {
    method: "POST",
    body: JSON.stringify({
      text: goodByeHacker(inputTextEl.value),
      name: goodByeHacker(inputNameEl.value),
      forceError: true,
    }),
  });
}
