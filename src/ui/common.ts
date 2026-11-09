export const contentEl = (() => {
  const c = document.getElementById("content");

  if (!c) {
    throw new Error("no Content Element found");
  }

  return c;
})();
