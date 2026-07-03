const express = require('express');
const cors = require('cors');
const config = require('./config');
const basicAuth = require('./auth');
const requestLogger = require('./middleware/logger');
const disponibilidadRouter = require('./routes/disponibilidad');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API disponible' });
});

if (config.auth.required) {
  app.use('/disponibilidad-inmueble', basicAuth, disponibilidadRouter);
} else {
  app.use('/disponibilidad-inmueble', disponibilidadRouter);
}

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

if (require.main === module) {
  app.listen(config.server.port, () => {
    console.log(`Servidor (${config.env}) escuchando en http://localhost:${config.server.port}`);
  });
}

module.exports = app;
