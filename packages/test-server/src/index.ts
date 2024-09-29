import express from "express";
import cors from "cors";

import { createRpapiServer } from "./api/.ag/server.ag";

const app = express();
const port = 3000;

app.options('*', cors());

createRpapiServer(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
