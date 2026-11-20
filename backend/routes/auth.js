const express = require('express');
const crypto = require('crypto');
const { usuarios, tokens } = require('../data/store');
const autenticar = require('../middleware/auth');

const router = express.Router();

// POST /login  { usuario, senha }  ->  { token }
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body || {};
  const user = usuarios.find((u) => u.usuario === usuario && u.senha === senha);

  if (!user) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }

  const token = crypto.randomUUID();
  tokens.add(token);
  res.json({ token, usuario: user.usuario });
});

// POST /logout  -> invalida o token (útil pra demonstrar "após sair da conta")
router.post('/logout', autenticar, (req, res) => {
  tokens.delete(req.token);
  res.status(204).send();
});

module.exports = router;
