import {
  createCoordPair,
  type Direction,
  type ShipPlacementRequest,
} from "../domain/gameboard";
import { createShip } from "../domain/ship";
import type { Command } from "../game-service";
import { contentEl } from "./common";

export interface CellData {
  x_coord: number;
  y_coord: number;
  cellEl: HTMLElement;
}

export type PromptPayload =
  | {
      kind: "attack";
      executeAttackCmd: (cmd: Command) => undefined | string;
    }
  | {
      kind: "place ship";
      remainingShipLengths: number[];
      executePlacementCmd: (cmd: Command) => undefined | string;
    };

export type PromptData = CellData & PromptPayload;

export function openPrompt(data: PromptData) {
  const promptEl = document.createElement("div");
  promptEl.classList.add("prompt");
  const textEl = document.createElement("div");
  switch (data.kind) {
    case "attack":
      textEl.textContent = "Do you want to attack the highlighted position?";
      break;
    case "place ship":
      textEl.textContent =
        "Do you want to place your ship on the highlighted position?";
      break;
  }
  promptEl.appendChild(textEl);

  const BtnContainer = document.createElement("div");
  BtnContainer.classList.add("btn-container");
  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Yes";
  const noBtn = document.createElement("button");
  noBtn.textContent = "No";

  if (data.kind === "place ship") {
    const formEl = document.createElement("form");

    const lengthLabelEl = document.createElement("label");
    lengthLabelEl.textContent = "Choose your ship length";
    lengthLabelEl.setAttribute("for", "length");
    const lengthSelectEl = document.createElement("select");
    lengthSelectEl.setAttribute("id", "length");
    // lengthSelectEl.setAttribute("type", "select");
    lengthSelectEl.append(
      ...data.remainingShipLengths.map((l) => {
        const optionEl = document.createElement("option");
        optionEl.textContent = String(l);
        return optionEl;
      }),
    );

    const directionLabelEl = document.createElement("label");
    directionLabelEl.textContent = "Choose the direction of the ship";
    directionLabelEl.setAttribute("for", "direction");
    const directionSelectEl = document.createElement("select");
    // directionSelectEl.setAttribute("type", "select");
    directionSelectEl.setAttribute("id", "direction");
    directionSelectEl.append(
      ...["right", "down"].map((d) => {
        const optionEl = document.createElement("option");
        optionEl.textContent = d;
        return optionEl;
      }),
    );

    formEl.append(
      lengthLabelEl,
      lengthSelectEl,
      directionLabelEl,
      directionSelectEl,
    );

    promptEl.appendChild(formEl);

    yesBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const request: ShipPlacementRequest = {
        headCoords: createCoordPair(data.x_coord, data.y_coord),
        ship: createShip(Number(lengthSelectEl.value)),
        direction: directionSelectEl.value as Direction,
      };

      data.executePlacementCmd({
        kind: "place ship",
        request,
      });
    });
  } else /* if (data.kind === "attack") */ {
    yesBtn.addEventListener("click", (e) => {
      e.preventDefault();

      data.executeAttackCmd({
        kind: "attack",
        coordPair: createCoordPair(data.x_coord, data.y_coord),
      });
    });
  }

  BtnContainer.append(yesBtn, noBtn);
  promptEl.appendChild(BtnContainer);
  contentEl.appendChild(promptEl);
}
