import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false
});

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
export const PORT = process.env.PORT || 3001;