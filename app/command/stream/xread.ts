import { StreamValue, type StreamId } from "../../memory";
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
    if (this.args.length < 3) throw "XRead command is invalid";

    const [_, ...streams] = this.args;

    const halfIndex = Math.floor(streams.length / 2);
    const keysToRead = streams.slice(0, halfIndex);
    const idsToRead = streams.slice(halfIndex);

    const items: Map<string, StreamValue> = new Map();

    for (let index = 0; index < halfIndex; index++) {
      const key = keysToRead[index];
      const id = idsToRead[index];

      const data = serverStore.get(key);

      if (!data) throw "The specified key dont exists";

      if (data.type !== "stream") throw "The key specified is not an stream";

      const millisecondsTime = +id.split("-")[0];
      const sequenceNumber = +id.split("-")[1];

      const values = data.value
        .entries()
        .filter(
          ([id]) =>
            id.millisecondsTime >= millisecondsTime &&
            id.sequenceNumber >= sequenceNumber
        )
        .toArray();

      items.set(key, new StreamValue(values));
    }

    return RedisProtocolResponse.arrayWithKey(items);
  }
}
