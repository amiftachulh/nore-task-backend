import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: process.env.PORT,
  },
  api: {
    auth: process.env.AUTH_API,
    task: process.env.TASK_API,
  },
};

export default config;
