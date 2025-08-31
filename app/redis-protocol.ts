import type { Command } from "./command/command";
import { createCommand } from "./command/factory";

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
      const command = this.data.match(`\r\n(?!\\$)(.{${commandLength}})\r\n`);

      if (command && command.length > 0) {
        const commandIndex = command.index ?? 0;
        const commandValue = command[1];
        commands.push(commandValue);
        this.data = this.data.slice(commandIndex + commandValue.length);
      }
    }

    if (commands.length === 0) throw "Invalid command";

    const commandType = commands.shift() as string;
    const commandArgs = commands;
    return createCommand(commandType, commandArgs);
  }
}
