export abstract class Command {
  static _type: string;
  abstract type: string;
  abstract args: string[];
  abstract run(): string;
}
