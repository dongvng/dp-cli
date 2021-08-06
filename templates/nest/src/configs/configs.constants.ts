import { config } from 'dotenv';
config();

export const databaseConfig = {
  type: process.env.DB_TYPE,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  synchronize: process.env.DB_SYNCHRONIZE,
};

export const appConfig = {
  port: process.env.APP_PORT,
};

export const bcryptConfig = {
  saltRound: (process.env.BCRYPT_SALT_ROUNDS as unknown) as number,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};

export const facebookConfig = {
  id: process.env.FACEBOOK_ID,
  secret: process.env.FACEBOOK_SECRET,
};

export const googleConfig = {
  id: process.env.GOOGLE_ID,
  secret: process.env.GOOGLE_SECRET,
};

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};
