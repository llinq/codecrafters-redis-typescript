import type { Command } from "../command";
import { serverStore } from "../../store";
import { WaitingClient } from "../../waiting-client";

const TYPE = "BLPOP";
const EMPTY = "*-1\r\n";

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

    const waitingClient = new WaitingClient(
      key,
      timeout > 0 ? timeout * 1000 : Infinity
    );

    waitingClient.queue();

    return waitingClient.promise
      .then((key) => {
        const data = serverStore.get<string[]>(key);
        if (data && data.value.length > 0) {
          const length = data.value.length + 1;
          return `*${length}\r\n$${key.length}\r\n${key}\r\n${data.value
            .map((item) => `$${item.length}\r\n${item}\r\n`)
            .join("")}`;
        } else {
          return EMPTY;
        }
      })
      .catch(() => EMPTY);
  }
}
