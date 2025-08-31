enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
}

class Command {
  command: string;

  constructor(command: string) {
    this.command = command;
  }

  runCommand(nextCommand?: Command): string {
    switch (this.command) {
      case "ECHO":
        if (!nextCommand) throw "ECHO is mailformed";
        return `$${nextCommand.command.length}\r\n${nextCommand.command}\r\n`
      case "PING":
        return `\r\nPONG\r\n`;
      default:
        return '';
    }
  }
}

export class RedisProtocol {
  data: string;

  constructor(data: string) {
    this.data = data;
  }

  deserialize(): Command[] {
    const commandsSize = +(this.data.match(/^\*(.*)/)?.[1] ?? 1);
    const commands: Command[] = [];

    for (let index = 0; index < commandsSize; index++) {
      const commandLength = this.data.match(/\$(\d+)\r\n/)?.[1] ?? 0;
      const command =
        this.data.match(`\r\n(.{${commandLength}})\r\n`)?.[1] ?? "";
      commands.push(new Command(command));
      this.data = this.data.split(command)?.[1] ?? this.data;
    }

    return commands;
  }
}
