require("dotenv").config();
require("./src/configs/db");
const { logger } = require("./src/utils/logger");

const app = require("./src/app");

const port = process.env.PORT || 3000;

logger.log("info", "**** server started ****");
app.listen(port, () => {
  logger.log("info", `Server is Listening on port ${port}`);
  console.log(`Server is Listening on port ${port}`);
});
