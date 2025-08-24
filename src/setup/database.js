import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: (() => {
      if (process.env.DB_SSL === 'true') {
        return {
          ssl: {
            require: true,
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
          }
        };
      }
      return {};
    })(),
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      underscored: true,
      timestamps: true
    }
  }
);

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
};
