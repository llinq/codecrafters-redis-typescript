import { serverStore } from "../../store";

export function lpush(args: string[]) {
  if (args.length < 2) throw "LPUSH command is invalid";

  const key = args.shift() ?? "";
  const values = args.reverse();

  let data = serverStore.get<string[]>(key);

  if (data && data instanceof Array) {
    data = [...values, ...data];
  } else {
    data = [...values];
  }

  serverStore.set(key, data);

  return `:${data.length}\r\n`;
}
