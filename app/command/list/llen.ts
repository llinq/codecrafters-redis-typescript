import type { Command } from "../command";
import { serverStore } from "../../store";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

const type = "LLEN";

export class LlenCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "LLEN command is invalid";

    const key = this.args[0];
    const data = serverStore.get(key);

    if (!data?.value || !Array.isArray(data.value) || data.value.length === 0) {
      return RedisProtocolResponse.integer(0);
    }

    return RedisProtocolResponse.integer(data.value.length);
  }
}
