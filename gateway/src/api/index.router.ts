import { Router } from "express";
import config from "../config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import {
  authenticate,
  checkIfAdmin,
  checkIfAdminOrProjectManager,
} from "./middleware";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { roleRouter } from "./role.router";

export const indexRouter = Router();

const mainOptions = {
  target: config.service.main,
  changeOrigin: true,
  onProxyReq: fixRequestBody,
};

const taskOptions = {
  target: config.service.task,
  changeOrigin: true,
  onProxyReq: fixRequestBody,
};

const taskService = ["/kategori-task", "/subtask"];

indexRouter.use(
  "/client",
  authenticate(),
  checkIfAdmin(),
  createProxyMiddleware(mainOptions)
);
indexRouter.use("/auth", authRouter);
indexRouter.use("/user", authenticate(), userRouter);
indexRouter.use("/role", authenticate(), checkIfAdmin(), roleRouter);
indexRouter.use("/project", authenticate(), createProxyMiddleware(mainOptions));
indexRouter.use(
  "/task",
  authenticate(),
  checkIfAdminOrProjectManager(),
  createProxyMiddleware(taskOptions)
);
indexRouter.use(
  taskService,
  authenticate(),
  createProxyMiddleware(taskOptions)
);
