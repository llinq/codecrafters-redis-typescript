import type { Command } from "../command";
import { serverStore } from "../../store";
import { WaitingClient } from "../../waiting-client";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

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

    let data = serverStore.get(key);

    let newValue: string[] = [];

    if (data?.value && Array.isArray(data.value)) {
      newValue = [...values, ...data.value];
    } else {
      newValue = [...values];
    }

    serverStore.set({
      key,
      data: {
        type: "string",
        value: newValue,
      },
    });

    const queueItemToResolve = WaitingClient.dequeue(key);

    if (queueItemToResolve) {
      queueItemToResolve.resolve(key);
    }

    return RedisProtocolResponse.integer(newValue.length);
  }
}
