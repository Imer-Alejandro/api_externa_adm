const sql = require('mssql');
const config = require('./config');

const poolPromise = new sql.ConnectionPool(config.sql)
  .connect()
  .then((pool) => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch((err) => {
    console.error('Error al conectar la base de datos:', err.message || err);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
};
