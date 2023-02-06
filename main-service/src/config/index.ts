import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  auth: {
    serviceToken: process.env.SERVICE_TOKEN_SECRET,
  },
  api: {
    auth: process.env.AUTH_API,
    task: process.env.TASK_API,
  },
};

export default config;
