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
    gateway: process.env.GATEWAY,
    main: process.env.MAIN_API,
  },
};

export default config;
