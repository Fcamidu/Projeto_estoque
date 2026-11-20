// Exige header:  Authorization: Bearer <token>
// Sem token ou token inválido -> 401
const { tokens } = require('../data/store');

function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token || !tokens.has(token)) {
    return res.status(401).json({ erro: 'Não autorizado: token ausente ou inválido' });
  }

  req.token = token;
  next();
}

module.exports = autenticar;
