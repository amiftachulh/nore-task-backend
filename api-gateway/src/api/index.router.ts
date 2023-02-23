import { Router, Request } from "express";
import config from "../config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const indexRouter = Router();

const routes = [
  {
    path: ["/auth", "/user", "/role"],
    target: config.service.auth,
  },
  {
    path: ["/client", "/project"],
    target: config.service.main,
  },
  {
    path: [
      "/kategori-task",
      "/task",
      "/label-task",
      "/komentar",
      "/subtask",
      "/label-subtask",
    ],
    target: config.service.task,
  },
];

routes.forEach(route => {
  const { path, ...options } = route;
  indexRouter.use(
    path,
    createProxyMiddleware({
      ...options,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    })
  );
});
