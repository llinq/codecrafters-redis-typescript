import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";
import { serverStore } from "../../store";
import type { Command } from "../command";

const type = "LPOP";

export class LpopCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length < 1) throw "LPOP command is invalid";

    const [key] = this.args;
    const removeLength = this.args[1] ? +this.args[1] : 1;

    const data = serverStore.get(key);

    if (!data?.value || !Array.isArray(data.value) || data.value.length === 0) {
      return RedisProtocolResponse.nullArray();
    }

    const response: string[] = [];

    for (let index = 0; index < removeLength; index++) {
      const item = data.value.shift();
      if (item) response.push(item);
    }

    serverStore.set({ key, data });

    if (response.length === 1) {
      return RedisProtocolResponse.simpleBulkString(response[0]);
    } else {
      return RedisProtocolResponse.array(response);
    }
  }
}
