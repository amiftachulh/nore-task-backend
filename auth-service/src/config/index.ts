import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
    serviceToken: process.env.SERVICE_TOKEN_SECRET,
  },
  api: {
    task: process.env.TASK_API,
  },
};

export default config;
