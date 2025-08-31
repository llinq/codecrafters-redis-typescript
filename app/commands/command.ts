import { echo } from "./base/echo";
import { get } from "./base/get";
import { llen } from "./base/llen";
import { lpush } from "./base/lpush";
import { lrange } from "./base/lrange";
import { ping } from "./base/ping";
import { rpush } from "./base/rpush";
import { set } from "./base/set";

export enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
  SET = "SET",
  GET = "GET",
  RPUSH = "RPUSH",
  LRANGE = "LRANGE",
  LPUSH = "LPUSH",
  LLEN = "LLEN",
}

export class Command {
  type: CommandType;
  args: string[];

  constructor(type: CommandType, args?: string[]) {
    this.type = type;
    this.args = args ?? [];
  }

  runCommand(): string {
    switch (this.type) {
      case CommandType.ECHO:
        return echo(this.args);
      case CommandType.PING:
        return ping();
      case CommandType.SET:
        return set(this.args);
      case CommandType.GET:
        return get(this.args);
      case CommandType.RPUSH:
        return rpush(this.args);
      case CommandType.LRANGE:
        return lrange(this.args);
      case CommandType.LPUSH:
        return lpush(this.args);
      case CommandType.LLEN:
        return llen(this.args);
      default:
        return "";
    }
  }
}
