import { serverStore } from "../../store";
import type { Command } from "../command";

import { Socket } from "net";

const TYPE = "BLOP";

export class BlopCommand implements Command {
  static _type: string = TYPE;
  type: string = TYPE;
  args: string[];
  async: boolean = true;

  constructor(args: string[]) {
    this.args = args;
  }

  run(): Promise<string> {
    if (this.args.length < 2) throw "BLOP command is invalid";

    const [key] = this.args;
    const timeout = +this.args[1];

    let data: string | undefined;

    return new Promise((resolve, reject) => {
      if (timeout > 0) {
        const interval = setInterval(() => {
          data = serverStore.get(key);
          if (data) resolve(data);
        }, 1000);

        // setTimeout(() => {
        //   if (!data) resolve();
        //   clearInterval(interval);
        // }, timeout * 1000);
      }
    });
  }
}
