const { app, PORT } = require("./app");
require("./apiTest");
require("./chatWS");

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
