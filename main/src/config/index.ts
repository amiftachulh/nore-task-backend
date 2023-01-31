import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  api: {
    task: process.env.TASK_API,
  },
};

export default config;
