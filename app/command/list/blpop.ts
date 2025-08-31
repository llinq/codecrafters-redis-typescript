import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "BLPOP";
const EMPTY = "$-1\r\n";

export class BlpopCommand implements Command {
  static _type: string = TYPE;
  type: string = TYPE;
  args: string[];
  async: boolean = true;

  constructor(args: string[]) {
    this.args = args;
  }

  run(): Promise<string> {
    if (this.args.length < 2) throw "BLPOP command is invalid";

    const [key] = this.args;
    const timeout = +this.args[1];

    let data: string[] | undefined;

    return new Promise((resolve) => {
      let connectionCloseIn = timeout > 0 ? timeout : Infinity;
      const interval = setInterval(() => {
        connectionCloseIn -= 1;
        data = serverStore.get<string[]>(key);
        if (data && data.length > 0) {
          const length = data.length + 1;
          resolve(
            `*${length}\r\n$${key.length}\r\n${key}\r\n${data
              .map((item) => `$${item.length}\r\n${item}\r\n`)
              .join("")}`
          );
          clearInterval(interval);
        } else if (connectionCloseIn === 0) {
          resolve(EMPTY);
          clearInterval(interval);
        }
      }, 1000);
    });
  }
}
