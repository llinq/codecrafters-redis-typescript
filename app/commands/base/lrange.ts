import { serverStore } from "../../store";

const EMPTY = "*0\r\n";

export function lrange(args: string[]) {
  if (args.length !== 3) throw "LRANGE command is invalid";

  const key = args[0];

  const data = serverStore.get<string[]>(key);

  if (!data || data.length === 0) return EMPTY;

  const indexStart = +args[1];
  const indexEnd = +args[2] + 1;

  if (indexStart >= data.length || indexStart >= indexEnd) return EMPTY;

  const items = data.slice(indexStart, indexEnd);

  return `*${items.length}\r\n${items
    .map((item) => `$${item.length}\r\n${item}\r\n`)
    .join("")}`;
}
