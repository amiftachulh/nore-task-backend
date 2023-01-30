import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
};

export default config;
