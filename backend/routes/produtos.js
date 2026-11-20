const express = require('express');
const Produto = require('../models/Produto');
const { produtos, gerarId } = require('../data/store');
const autenticar = require('../middleware/auth');

const router = express.Router();
router.use(autenticar); // todas as rotas abaixo exigem token

const achar = (id) => produtos.findIndex((p) => p.id === Number(id));

// GET /produtos
router.get('/', (req, res) => res.json(produtos));

// GET /produtos/:id
router.get('/:id', (req, res) => {
  const i = achar(req.params.id);
  if (i === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produtos[i]);
});

// POST /produtos
router.post('/', (req, res) => {
  try {
    const produto = new Produto({ ...req.body, id: gerarId() });
    produtos.push(produto);
    res.status(201).json(produto);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// PUT /produtos/:id
router.put('/:id', (req, res) => {
  const i = achar(req.params.id);
  if (i === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  try {
    const atual = produtos[i];
    // Reconstrói com os dados novos (os setters validam tudo)
    produtos[i] = new Produto({
      ...atual.toJSON(),
      ...req.body,
      id: atual.id,
      dataCadastro: atual.dataCadastro,
    });
    res.json(produtos[i]);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// DELETE /produtos/:id
router.delete('/:id', (req, res) => {
  const i = achar(req.params.id);
  if (i === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  produtos.splice(i, 1);
  res.status(204).send();
});

module.exports = router;
