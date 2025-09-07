import type { Command } from "../command";
import { serverStore } from "../../store";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";

const type = "SET";

export class SetCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length < 2) throw "SET command is invalid";
    const [key, value] = this.args;
    const expiration = this.args.length > 3 ? +this.args[3] : undefined;
    serverStore.set({
      key,
      data: {
        type: "string",
        value,
      },
      options: { expirationTime: expiration },
    });
    return RedisProtocolResponse.simpleString("OK");
  }
}
