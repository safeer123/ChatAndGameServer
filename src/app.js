const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = 8080;

const app = express();
var expressWs = require("express-ws")(app);

app.use(cors());

app.use(express.static(path.join(__dirname, "css")));

app.get("/", (req, res) => {
  // console.log(req.headers);
  res.send(`
  <html>
  <head>
    <link href="styles.css">
  </head>
  <body>
  <table>
  <tr>
    <th>Express Server Running at ${PORT}</th>
  </tr>
  <tr>
    <td>
    ${"Chat and Game"}
    </td>
  </tr>
  </table>
  </body>
  </html>`);
});

module.exports = { app, expressWs, PORT };
