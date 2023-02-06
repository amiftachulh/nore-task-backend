import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  service: {
    auth: process.env.AUTH_SERVICE_URL,
    main: process.env.MAIN_SERVICE_URL,
    task: process.env.TASK_SERVICE_URL,
  },
};

export default config;
