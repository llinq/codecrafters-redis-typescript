import { StreamValue } from "../../memory";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";
import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "XREAD";

export class XreadCommand implements Command {
  static _type: string = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 3) throw "XRead command is invalid";

    const [_, key, streamId] = this.args;

    const data = serverStore.get(key);

    if (!data) throw "The specified key dont exists";

    if (data.type !== "stream") throw "The key specified is not an stream";

    const millisecondsTime = +streamId.split("-")[0];
    const sequenceNumber = +streamId.split("-")[1];

    const items = data.value
      .entries()
      .filter(
        ([id]) =>
          id.millisecondsTime >= millisecondsTime &&
          id.sequenceNumber >= sequenceNumber
      );

    return RedisProtocolResponse.arrayWithKey(key, new StreamValue(items));
  }
}
