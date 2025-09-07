import { StreamValue, type StreamId } from "../../memory";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";
import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "XRANGE";

export class XrangeCommand implements Command {
  static _type = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 3) throw "XRANGE command is invalid";

    const [key, start, end] = this.args;

    const data = serverStore.get(key);

    if (!data || data.type !== "stream")
      throw "The key specified is not an stream";

    const startFilter: StreamId = {
      millisecondsTime: +start.split("-")[0],
      sequenceNumber: +start.split("-")[1] || 0,
    };

    const endFilter: StreamId = {
      millisecondsTime: +end.split("-")[0],
      sequenceNumber: +end.split("-")[1] || 0,
    };

    const items = data.value
      .entries()
      .filter(
        ([key]) =>
          key.millisecondsTime >= startFilter.millisecondsTime &&
          key.sequenceNumber >= startFilter.sequenceNumber &&
          key.millisecondsTime <= endFilter.millisecondsTime &&
          key.sequenceNumber <= endFilter.sequenceNumber
      );

    return RedisProtocolResponse.array(new StreamValue(items));
  }
}
