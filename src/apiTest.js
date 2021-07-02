const { app } = require("./app");

let num = 0;
setInterval(() => {
  num += 1;
}, 3000);

app.get("/test", (req, res) => {
  res.send(`TestResp ${num}`);
});

app.post("/addNumber", function (req, res) {
  res.send("Got a POST request /addNumber");
});
