import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  MONGODB_URL: str(),
  DB_NAME: str(),
});
