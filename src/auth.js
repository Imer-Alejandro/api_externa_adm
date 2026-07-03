const { auth } = require('./config');

function basicAuth(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Basic ')) {
    return unauthorized(res);
  }

  const base64Credentials = authorization.slice(6);
  let credentials;

  try {
    credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  } catch (err) {
    return unauthorized(res);
  }

  const [username, password] = credentials.split(':');
  if (username === auth.username && password === auth.password) {
    return next();
  }

  return unauthorized(res);
}

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Acceso restringido"');
  return res.status(401).json({ error: 'No autorizado' });
}

module.exports = basicAuth;
