const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  sql: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_NAME,
    options: {
      encrypt: true,
      trustServerCertificate: process.env.TRUST_SERVER_CERT === 'true',
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
  auth: {
    required: process.env.AUTH_REQUIRED !== 'false',
    username: process.env.API_USER,
    password: process.env.API_PASS,
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
};
