const { app, expressWs } = require("./app");
const { ChatCtl } = require("./chatController");
const { get } = require("lodash");

const wss = expressWs.getWss();

// on receiving pong we set isAlive to true
const heartbeat = (ws) => {
  ws.isAlive = true;
};

app.ws("/chat", function (ws, req) {
  ws.on("message", function (msg) {
    const msgObj = JSON.parse(msg);
    const msgTxt = get(msgObj, "body.msg");
    const ip = req.headers["x-real-ip"];
    ChatCtl.sendAll(wss, msgTxt, ip);
  });

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
