import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: process.env.PORT,
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
  },
  api: {
    task: process.env.TASK_API,
  },
};

export default config;
