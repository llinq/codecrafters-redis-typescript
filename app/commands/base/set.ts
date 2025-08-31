import { serverStore } from "../../store";

export function set(args: string[]) {
  if (args.length < 2) throw "SET command is invalid";
  serverStore.set(args[0], args[1], args.length > 3 ? +args[3] : undefined);
  return "+OK\r\n";
}
