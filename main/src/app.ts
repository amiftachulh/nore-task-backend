import express, { Express, json } from "express";
import config from "./config";
import cors from "cors";
import { indexRouter } from "./api/index.router";
import { checkDbConnection } from "./api/middleware";

const app: Express = express();

app.use(cors({ credentials: true, origin: true }));
app.use(json({ strict: false }));

app.use("/api", checkDbConnection(), indexRouter);

const host = config.server.host;
const port = config.server.port;

app.listen(port, () =>
  console.log(`Main service is listening to ${host}:${port}`)
);
