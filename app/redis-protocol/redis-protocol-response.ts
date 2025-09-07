import type { StreamValue } from "../memory";

const cr_lf = "\r\n";

export class RedisProtocolResponse {
  /**
   {Return "+{value}\r\n"
  */
  static simpleString(value: string) {
    return "+" + value + cr_lf;
  }

  /**
   {Return "-{error}"
  */
  static simpleError(error: string) {
    return "-" + error;
  }

  /**
    Return ":{length}\r\n"
  */
  static integer(length: number) {
    return ":" + length + cr_lf;
  }

  /**
    Return "${data.length}\r\n{data}\r\n"
  */
  static simpleBulkString(data: string): string;

  /**
    Return "${size}\r\n{data}\r\n"
  */
  static simpleBulkString(data: string, size: number): string;

  static simpleBulkString(data: string, size?: number) {
    return "$" + (size ? size : data.length) + cr_lf + data + cr_lf;
  }

  /**
    Return "$0\r\n"
  */
  static emptyBulkString() {
    return "$" + 0 + cr_lf + cr_lf;
  }

  /**
    Return "$-1\r\n"
  */
  static nullBulkString() {
    return "$" + -1 + cr_lf;
  }

  /**
    Return "*{number-of-elements + 1}\r\n{key.length}\r\n{key}\r\n{element-1}...{element-n}"
  */
  static arrayWithKey(key: string, values: string[] | Array<string[]>) {
    return (
      "*" +
      (values.length + 1) +
      cr_lf +
      this.simpleBulkString(key) +
      values
        .map((value) => {
          if (Array.isArray(value)) return this.array(value);
          else return this.simpleBulkString(value);
        })
        .join("")
    );
  }

  /**
    Return "*{number-of-elements}\r\n{element-1}...{element-n}"
  */
  static array(values: StreamValue): string;

  /**
    Return "*{number-of-elements}\r\n{element-1}...{element-n}"
  */
  static array(values: string[]): string;

  static array(values: string[] | StreamValue) {
    if (Array.isArray(values)) {
      return (
        "*" +
        values.length +
        cr_lf +
        values.map((value) => this.simpleBulkString(value)).join("")
      );
    } else {
      return (
        "*" +
        values.size +
        cr_lf +
        values
          .entries()
          .map(([key, value]) => {
            const id = `${key.millisecondsTime}-${key.sequenceNumber}`;
            const values = Array.from(value.entries());
            return this.arrayWithKey(id, values);
          })
          .toArray()
          .join("")
      );
    }
  }

  /**
    Return *-1\r\n
  */
  static nullArray() {
    return "*" + -1 + cr_lf;
  }
}
