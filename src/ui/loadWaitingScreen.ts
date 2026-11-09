import { contentEl } from "./common";

export function loadWaitingScreen(onClick: () => void) {
  contentEl.replaceChildren();
  const waitingTextEl = document.createElement("h2");
  waitingTextEl.textContent =
    "When you have switcehed devices, click the button";

  const btn = document.createElement("button");
  btn.textContent = "Switch player view";

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    onClick();
  });

  contentEl.append(waitingTextEl, btn);
}
