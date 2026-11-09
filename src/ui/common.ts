export function getContentEl(): HTMLElement {
  const contentEl = document.getElementById("content");

  if (!contentEl) {
    throw new Error("no Content Element found");
  }

  return contentEl;
}
