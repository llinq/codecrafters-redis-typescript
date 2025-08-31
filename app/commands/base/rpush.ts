import { serve } from "bun";
import { serverStore } from "../../store";

export function rpush(args: string[]) {
  if (args.length < 2) throw "RPUSH command is invalid";

  const key = args.shift() ?? "";
  const values = args;

  const dataStored = serverStore.get(key);
  let newData: string[];

  if (dataStored && dataStored instanceof Array) {
    newData = [...dataStored, ...values];
  } else {
    newData = [...values];
  }

  return `:${newData.length}\r\n`;
}
