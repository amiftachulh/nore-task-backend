import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST || "http://localhost",
    port: process.env.PORT || 5000,
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || "secret",
    refreshToken: process.env.REFRESH_TOKEN_SECRET || "secret",
  },
  service: {
    main: process.env.MAIN_SERVICE_URL || "http://localhost:5001",
    task: process.env.TASK_SERVICE_URL || "http://localhost:5002",
  },
};

export default config;
