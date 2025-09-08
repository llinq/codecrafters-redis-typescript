import type { Command } from "../command";
import { serverStore } from "../../store";
import { WaitingClient } from "../../waiting-client";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

const TYPE = "BLPOP";

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
        const data = serverStore.get(key);
        if (data && Array.isArray(data.value) && data.value.length > 0) {
          return RedisProtocolResponse.array([key, ...data.value]);
        } else {
          return RedisProtocolResponse.nullArray();
        }
      })
      .catch(() => RedisProtocolResponse.nullArray());
  }
}
