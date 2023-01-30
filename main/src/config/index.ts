import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST || "http://localhost",
    port: process.env.PORT || 5001,
  },
  api: {
    task: process.env.TASK_API || "http://localhost:5002",
  },
};

export default config;
