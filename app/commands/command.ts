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
  commandType: CommandType;
  params: string[];

  constructor(commandType: CommandType, params?: string[]) {
    this.commandType = commandType;
    this.params = params ?? [];
  }

  runCommand(): string {
    switch (this.commandType) {
      case CommandType.ECHO:
        return echo(this.params);
      case CommandType.PING:
        return ping();
      case CommandType.SET:
        return set(this.params);
      case CommandType.GET:
        return get(this.params);
      default:
        return "";
    }
  }
}
