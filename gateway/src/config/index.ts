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
  },
  service: {
    main: process.env.MAIN_SERVICE_URL,
    task: process.env.TASK_SERVICE_URL,
  },
};

export default config;
