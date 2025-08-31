export function echo(args: string[]) {
  if (args.length !== 1) throw "ECHO command is invalid";
  return `$${args[0].length}\r\n${args[0]}\r\n`;
}
