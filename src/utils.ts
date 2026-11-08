export function colorAnsiiRed(s: string) {
  return colorAnsi(s, "31");
}

export function colorAnsiiYellow(s: string) {
  return colorAnsi(s, "33");
}

function colorAnsi(s: string, code: string) {
  return `\x1b[${code}m${s}\x1b[0m`;
}
