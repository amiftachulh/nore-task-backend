import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  api: {
    auth: process.env.AUTH_API,
    main: process.env.MAIN_API,
  },
};

export default config;
