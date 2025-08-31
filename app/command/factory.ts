import type { Command } from "./command";

type CommandCtor = new (args: string[]) => Command;

export class CommandFactory {
  private static registry: Map<string, CommandCtor> = new Map();

  static register(type: string, ctor: CommandCtor) {
    this.registry.set(type, ctor);
  }

  static create(type: string, args: string[] = []): Command {
    const ctor = this.registry.get(type.toUpperCase());
    if (!ctor) {
      throw new Error(`Unknown command: ${type}`);
    }
    return new ctor(args);
  }
}

export function createCommand(type: string, args: string[] = []): Command {
  return CommandFactory.create(type, args);
}
