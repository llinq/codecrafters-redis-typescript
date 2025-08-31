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
    if (this.args.length !== 1) throw "LPOP command is invalid";

    const [key] = this.args;

    const data = serverStore.get<string[]>(key);

    if (!data || data.length === 0) return EMPTY;

    const firstElement = data.shift();

    serverStore.set(key, data);

    return `$${firstElement?.length}\r\n${firstElement}\r\n`;
  }
}
