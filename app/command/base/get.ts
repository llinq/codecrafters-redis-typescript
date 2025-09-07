import type { Command } from "../command";
import { serverStore } from "../../store";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

const type = "GET";

export class GetCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "GET command is invalid";
    const storedValue = serverStore.get(this.args[0]);

    if (!storedValue?.value) {
      return RedisProtocolResponse.nullBulkString();
    }

    if (storedValue.value instanceof Map && storedValue.type === "string") {
      return RedisProtocolResponse.simpleBulkString(
        storedValue.value.toString(),
        storedValue.value.size
      );
    } else {
      return RedisProtocolResponse.simpleBulkString(
        storedValue.value.toString()
      );
    }
  }
}
