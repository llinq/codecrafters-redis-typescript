import type { Command } from "../command";
import { serverStore } from "../../store";
import { WaitingClient } from "../../waiting-client";

const type = "LPUSH";

export class LpushCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length < 2) throw "LPUSH command is invalid";

    const key = this.args[0];
    const values = this.args.slice(1).reverse();

    let data = serverStore.get<string[]>(key);

    if (data && data instanceof Array) {
      data = [...values, ...data];
    } else {
      data = [...values];
    }

    serverStore.set(key, data);

    const queueItemToResolve = WaitingClient.dequeue(key);

    if (queueItemToResolve) {
      queueItemToResolve.resolve(key);
    }

    return `:${data.length}\r\n`;
  }
}
