import type { Command } from "../command";
import { serverStore } from "../../store";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

const type = "LRANGE";

export class LrangeCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 3) throw "LRANGE command is invalid";

    const key = this.args[0];
    const data = serverStore.get(key);

    if (!data?.value || !Array.isArray(data.value) || data.value.length === 0) {
      return RedisProtocolResponse.array([]);
    }

    const indexStart = +this.args[1];
    const indexEnd = +this.args[2] + 1;

    const items = data.value.slice(
      indexStart,
      indexEnd === 0 ? undefined : indexEnd
    );

    return RedisProtocolResponse.array(items);
  }
}
