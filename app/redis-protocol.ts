import { Command, CommandType } from "./commands/command";

export class RedisProtocol {
  data: string;

  constructor(data: string) {
    this.data = data;
  }

  deserialize(): Command {
    const commandsSize = +(this.data.match(/^\*(.*)/)?.[1] ?? 1);
    const commands: string[] = [];

    for (let index = 0; index < commandsSize; index++) {
      const commandLength = this.data.match(/\$(\d+)\r\n/)?.[1] ?? 0;
      const command =
        this.data.match(`\r\n(.{${commandLength}})\r\n`)?.[1] ?? "";
      if (command) {
        commands.push(command);
        this.data = this.data.substring(
          this.data.indexOf(command) + command.length
        );
      }
    }

    if (commands.length === 0) throw "Invalid command";

    const commandType = commands.shift() as CommandType;
    const commandArgs = commands;
    return new Command(commandType, commandArgs);
  }
}
