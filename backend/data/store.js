// "Banco de dados" em memória: usuários e produtos pré-cadastrados.
// Os dados somem quando o servidor reinicia (o enunciado permite isso).
const Produto = require('../models/Produto');

const usuarios = [
  { id: 1, usuario: 'admin', senha: '123456' },
  { id: 2, usuario: 'mateus', senha: 'senha123' },
];

const produtos = [
  new Produto({ id: 1, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 249.9, quantidade: 15, fornecedor: 'TechParts' }),
  new Produto({ id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 129.9, quantidade: 3, fornecedor: 'TechParts' }),
  new Produto({ id: 3, nome: 'Monitor 24"', categoria: 'Monitores', preco: 899.0, quantidade: 8, fornecedor: 'VisualTech' }),
  new Produto({ id: 4, nome: 'Cabo HDMI 2m', categoria: 'Cabos', preco: 29.9, quantidade: 40, fornecedor: 'ConectaMais' }),
];

// Tokens válidos no momento (login adiciona, logout remove)
const tokens = new Set();

let proximoId = produtos.length + 1;
const gerarId = () => proximoId++;

module.exports = { usuarios, produtos, tokens, gerarId };

