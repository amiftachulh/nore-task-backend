import express, { Express, Request, Response, json } from "express";
import config from "./config";
import cors from "cors";
import { indexRouter } from "./api/index.router";

const app: Express = express();

app.use(cors({ credentials: true, origin: true }));
app.use(json({ strict: false }));

app.use("/api", indexRouter);

const host = config.server.host;
const port = config.server.port;

app.get("/", async (_: Request, res: Response) =>
  res.status(200).send("Welcome to Main Service!")
);

app.listen(port, () =>
  console.log(`Main service is listening to ${host}:${port}`)
);
