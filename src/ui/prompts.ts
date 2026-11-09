import type { Command } from "../game-service";

export type PromptData =
  | {
      text: "Do you want to attack the highlighted position?";
      x_coord: number;
      y_coord: number;
      headCellEl: HTMLElement;
      attackCmd: (cmd: Command) => undefined | string;
    }
  | {
      text: "Do you want to place your ship on the highlighted position?";
      head_x: number;
      head_y: number;
      headCellEl: HTMLElement;
      placeCmd: (cmd: Command) => undefined | string;
    };

export function openAttackPrompt(data: PromptData) {
  const promptEl = document.createElement("div");
  promptEl.classList.add("prompt");

  const textEl = document.createElement("div");
  textEl.textContent = data.text;

  const BtnContainer = document.createElement("div");

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Yes";
  yesBtn.addEventListener("click", (e) => {
    e.preventDefault();
  });

  const noBtn = document.createElement("button");
  noBtn.textContent = "No";

  BtnContainer.append(yesBtn, noBtn);
  promptEl.append(textEl, BtnContainer);
}
