import { serverStore } from "../../store";

export function lrange(args: string[]) {
  if (args.length !== 3) throw "LRANGE command is invalid";

  const key = args[0];
  const indexStart = +args[1];
  const indexEnd = +args[2];

  const data = serverStore.get<string[]>(key);

  if (!data || data.length === 0) return "*0\r\n";

  const items = data.slice(indexStart, indexEnd);

  return `*${items?.length}\r\n${items.map(
    (item) => `$${item.length}\r\n${item}\r\n`
  )}`;
}
