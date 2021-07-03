const { app, expressWs } = require("./app");
const { ChatCtl } = require("./chatController");
const url = require("url");

const wss = expressWs.getWss();

// on receiving pong we set isAlive to true
const heartbeat = (ws) => {
  ws.isAlive = true;
};

app.ws("/chat", (ws, req) => {
  ws.on("message", (msg) => {
    const msgObj = JSON.parse(msg);
    const ip = req.headers["x-real-ip"];
    ChatCtl.handleMsg(wss, ws, msgObj, ip);
  });

  const queryData = url.parse(req.url, true).query;
  ws.clientData = queryData;
  console.log("queryData: ", queryData);
  ChatCtl.accept(ws);

  const ip = req.headers["x-real-ip"];
  console.log(`Joined WS with IP: ${ip}`);
  const msg = `Joined - IP ${ip}`;
  ChatCtl.sendAll(wss, msg, "Bot");

  // ping-pong initial step
  ws.isAlive = true;
  ws.on("pong", () => {
    heartbeat(ws);
    // console.log("received pong..");
  });
});

// ping-pong setup to ping all clients
// automatic pong message will be received
const interval = setInterval(() => {
  let count = 0;
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log("terminating ws..");
      return ws.terminate();
    }

    count += 1;
    ws.isAlive = false;
    ws.ping(() => {});
    // console.log("pinging ws..");
  });
  ChatCtl.sendHeartbeatToAll(wss, count);
}, 15000);

wss.on("close", () => {
  clearInterval(interval);
});
