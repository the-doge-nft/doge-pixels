const logger = require("./config");
const keepAlive = ({
                     provider,
                     onDisconnect,
                     expectedPongBack = 15000,
                     checkInterval = 7500,
                   }) => {
  let pingTimeout;
  let keepAliveInterval;

  provider._websocket.on('open', () => {
    keepAliveInterval = setInterval(() => {
      provider._websocket.ping();
      logger.info("WS PING")

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate();
      }, expectedPongBack);
    }, checkInterval);
  });

  provider._websocket.on('close', (err) => {
    logger.info("WS DISCONNECTING")
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
    if (pingTimeout) {
      clearTimeout(pingTimeout);
    }
    onDisconnect(err);
  });

  provider._websocket.on('pong', () => {
    logger.info("WS PONG")
    if (pingTimeout) {
      clearInterval(pingTimeout);
    }
  });
};

module.exports = {keepAlive}
