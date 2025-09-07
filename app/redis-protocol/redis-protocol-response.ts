const cr_lf = "\r\n";

export class RedisProtocolResponse {
  /**
   {Return "+<value}\r\n"
  */
  static simpleString(value: string) {
    return "+" + value + cr_lf;
  }

  /**
   {Return "-<error}"
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
  static arrayWithKey(key: string, values: string[]) {
    return (
      "*" +
      (values.length + 1) +
      cr_lf +
      "$" +
      key.length +
      cr_lf +
      key +
      cr_lf +
      values.map((value) => this.simpleBulkString(value)).join("")
    );
  }

  /**
    Return "*{number-of-elements}\r\n{element-1}...{element-n}"
  */
  static array(values: string[]) {
    return (
      "*" +
      values.length +
      cr_lf +
      values.map((value) => this.simpleBulkString(value)).join("")
    );
  }

  /**
    Return *-1\r\n
  */
  static nullArray() {
    return "*" + -1 + cr_lf;
  }
}
