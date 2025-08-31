import { serverStore } from "../../store";

export function get(args: string[]) {
  if (args.length !== 1) throw "GET command is invalid";
  const storedValue = serverStore.get(args[0]);
  return storedValue
    ? `$${storedValue.length}\r\n${storedValue}\r\n`
    : "$-1\r\n";
}
