import type { Command } from "../command";
import { serverStore } from "../../store";

const type = "GET";

export class GetCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "GET command is invalid";
    const storedValue = serverStore.get(this.args[0]);

    if (!storedValue?.value) {
      return "$-1\r\n";
    }

    if (storedValue.value instanceof Map) {
      return `$${storedValue.value.size}\r\n${storedValue.value}\r\n`;
    } else {
      return `$${storedValue.value.length}\r\n${storedValue.value}\r\n`;
    }
  }
}
