import type { Command } from "../command";
import { serverStore } from "../../store";

const type = 'LLEN';

export class LlenCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "LLEN command is invalid";

    const key = this.args[0];
    const data = serverStore.get<string[]>(key);

    if (!data || !data?.length) {
      return ":0\r\n";
    }

    return `:${data.length}\r\n`;
  }
}
