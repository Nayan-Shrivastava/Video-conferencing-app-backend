import dotenv from 'dotenv';
import dbConfig from './db';

dotenv.config();

const config = {
  db: dbConfig,
  port: process.env.PORT ?? 3000,
};
export default config;
