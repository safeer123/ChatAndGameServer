const { app, PORT } = require("./src/app");
require("./src/apiTest");
require("./src/chatWS");

const port = process.env.PORT || PORT;

// Start the server
app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
