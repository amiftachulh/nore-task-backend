import { Router, Request } from "express";
import http from "http";
import config from "../config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authenticate, AuthorizedRequest } from "./middleware";

export const indexRouter = Router();

const routes = [
  {
    path: ["/auth", "/user", "/role"],
    auth: false,
    target: config.service.auth,
  },
  {
    path: ["/client", "/project"],
    auth: true,
    target: config.service.main,
  },
  {
    path: ["/kategori-task", "/task", "/komentar", "/subtask"],
    auth: true,
    target: config.service.task,
  },
];

routes.forEach(route => {
  const { path, auth, ...options } = route;
  indexRouter.use(
    path,
    authenticate(auth),
    createProxyMiddleware({
      ...options,
      changeOrigin: true,
      onProxyReq: (proxyReq: http.ClientRequest, req: Request) => {
        const user = (req as AuthorizedRequest).user;
        if (user) proxyReq.setHeader("X-User", JSON.stringify(user));
        fixRequestBody(proxyReq, req);
      },
    })
  );
});
