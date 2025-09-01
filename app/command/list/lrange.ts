import type { Command } from "../command";
import { serverStore } from "../../store";

const EMPTY = "*0\r\n";
const type = "LRANGE";

export class LrangeCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 3) throw "LRANGE command is invalid";

    const key = this.args[0];
    const data = serverStore.get<string[]>(key);

    if (!data || data.value.length === 0) return EMPTY;

    const indexStart = +this.args[1];
    const indexEnd = +this.args[2] + 1;

    const items = data.value.slice(
      indexStart,
      indexEnd === 0 ? undefined : indexEnd
    );

    return `*${items.length}\r\n${items
      .map((item) => `$${item.length}\r\n${item}\r\n`)
      .join("")}`;
  }
}
