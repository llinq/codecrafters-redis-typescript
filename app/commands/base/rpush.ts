import { serverStore } from "../../store";

export function rpush(args: string[]) {
  if (args.length < 2) throw "RPUSH command is invalid";

  const key = args.shift() ?? "";
  const values = args;

  let data = serverStore.get<string[]>(key);

  if (data && data instanceof Array) {
    data.push(...values);
  } else {
    data = [...values];
  }

  return `:${data.length}\r\n`;
}
