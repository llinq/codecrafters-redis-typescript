import { serverStore } from "../../store";

export function llen(args: string[]) {
  if (args.length !== 1) throw "LLEN command is invalid";

  const key = args[0];

  const data = serverStore.get<string[]>(key);

  if (!data || !data?.length) {
    return ":0\r\n";
  }

  return `:${data.length}\r\n`;
}
