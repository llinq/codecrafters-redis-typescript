import * as net from "net";

const client = net.createConnection(6379, "127.0.0.1", () => {
  client.write("*3\r\n$5\r\nRPUSH\r\n$9\r\npineapple\r\n$9\r\npineapple\r\n");

  client.on('data', (data) => {
    console.log('[client] received: ' + data);
  })
});
