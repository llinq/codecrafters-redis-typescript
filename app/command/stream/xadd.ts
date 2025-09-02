import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "XADD";
const EMPTY = "*-1\r\n";

export class XaddCommand implements Command {
  static _type = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length < 4) throw "XADD command is invalid";

    const key = this.args.shift() ?? "";
    const id = this.args.shift() ?? "";

    const value: Map<string, string> = new Map();

    for (let index = 0; index < this.args.length; index += 2) {
      if (!this.args[index + 1]) throw "XADD command is invalid";

      const itemKey = this.args[index];
      const itemValue = this.args[index + 1];

      value.set(itemKey, itemValue);
    }

    serverStore.set({
      key,
      data: {
        type: "stream",
        id,
        value,
      },
    });

    return `$${id.length}\r\n${id}\r\n`;
  }
}
