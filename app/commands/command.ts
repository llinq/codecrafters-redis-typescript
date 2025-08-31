import { echo } from "./base/echo";
import { get } from "./base/get";
import { ping } from "./base/ping";
import { set } from "./base/set";

export enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
  SET = "SET",
  GET = "GET",
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
      default:
        return "";
    }
  }
}
