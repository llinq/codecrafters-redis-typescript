import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";
import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "TYPE";

export class TypeCommand implements Command {
  static _type: string = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "TYPE command is invalid";

    const [key] = this.args;

    const data = serverStore.get(key);

    return RedisProtocolResponse.simpleString(data ? data.type : 'none');
  }
}
