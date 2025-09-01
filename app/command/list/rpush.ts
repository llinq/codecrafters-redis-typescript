import type { Command } from "../command";
import { serverStore } from "../../store";
import { WaitingClient } from "../../waiting-client";

const type = "RPUSH";

export class RpushCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }
  run(): string {
    if (this.args.length < 2) throw "RPUSH command is invalid";

    const key = this.args[0];
    const values = this.args.slice(1);

    let data = serverStore.get<string[]>(key);

    let newData: string[] = [];

    if (data && data.value instanceof Array) {
      newData = [...data.value, ...values];
    } else {
      newData = [...values];
    }

    serverStore.set(key, newData);

    const queueItemToResolve = WaitingClient.dequeue(key);

    if (queueItemToResolve) {
      queueItemToResolve.resolve(key);
    }

    return `:${newData.length}\r\n`;
  }
}
