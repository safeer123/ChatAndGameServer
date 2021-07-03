const moment = require("moment");
const { get } = require("lodash");
const { v4: uuidv4 } = require("uuid");

class ChatController {
  createAcceptedConfirmationMessage(userId) {
    const obj = {
      type: "ACCEPTED",
      body: {
        userId,
        t: moment().valueOf()
      }
    };
    return JSON.stringify(obj);
  }

  createChatMessage(msg, nickname, userId, ip) {
    const obj = {
      type: "CHAT",
      body: {
        msg,
        from: nickname,
        ip,
        userId,
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

  sendAll(wss, msg, sender) {
    wss.clients.forEach((ws) => {
      ws.send(this.createChatMessage(msg, sender, "null", "null"));
    });
  }

  handleMsg(wss, wsSender, msgObj, ip) {
    const msgTxt = get(msgObj, "body.msg");
    const userId = get(msgObj, "body.userId");
    const nickname = get(wsSender, "clientData.nickname");

    if (msgTxt && userId) {
      wss.clients.forEach((ws) => {
        ws.send(this.createChatMessage(msgTxt, nickname, userId, ip));
      });
    }
  }

  sendHeartbeatToAll(wss, n) {
    wss.clients.forEach((ws) => {
      ws.send(this.createHeartbeatMessage(n));
    });
  }

  accept(ws) {
    const userId = uuidv4();
    ws.userId = userId;
    ws.send(this.createAcceptedConfirmationMessage(userId));
  }
}

const ChatCtl = new ChatController();

module.exports = { ChatCtl };
