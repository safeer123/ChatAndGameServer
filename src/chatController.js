const moment = require("moment");

class ChatController {
  createChatMessage(msg, from) {
    const obj = {
      type: "CHAT",
      body: {
        msg,
        from,
        time: moment().format("MMM-DD HH:mm:ss"),
        t: moment().valueOf()
      }
    };
    return JSON.stringify(obj);
  }

  createHeartbeatMessage(total) {
    const obj = {
      type: "HEARTBEAT",
      body: {
        total
      }
    };
    return JSON.stringify(obj);
  }

  sendAll(wss, msg, from) {
    wss.clients.forEach((ws) => {
      ws.send(this.createChatMessage(msg, from));
    });
  }

  sendHeartbeatToAll(wss, n) {
    wss.clients.forEach((ws) => {
      ws.send(this.createHeartbeatMessage(n));
    });
  }
}

const ChatCtl = new ChatController();

module.exports = { ChatCtl };
