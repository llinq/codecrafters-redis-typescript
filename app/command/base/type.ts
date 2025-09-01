import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "TYPE";

export class TypeCommand implements Command {
  static _type: string = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "TYPE command is invalid";

    const [key] = this.args;

    const data = serverStore.get(key);

    if (data) {
      return `+${typeof data}\r\n`;
    } else {
      return "+none\r\n";
    }
  }
}
