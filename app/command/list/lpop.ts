import { serverStore } from "../../store";
import type { Command } from "../command";

const type = "LPOP";
const EMPTY = "$-1\r\n";

export class LpopCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length < 1) throw "LPOP command is invalid";

    const [key] = this.args;
    const removeLength = this.args[1] ? +this.args[1] : 1;

    const data = serverStore.get<string[]>(key);

    if (!data || data.value.length === 0) return EMPTY;

    const response: string[] = [];

    for (let index = 0; index < removeLength; index++) {
      const item = data.value.shift();
      if (item) response.push(item);
    }

    serverStore.set(key, data.value);

    if (response.length === 1)
      return `$${response[0].length}\r\n${response[0]}\r\n`;
    else
      return `*${response.length}\r\n${response
        .map((item) => `$${item.length}\r\n${item}\r\n`)
        .join("")}`;
  }
}
