// Monta o app Express (separado do server.js para facilitar os testes)
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');

const app = express();
app.use(cors());          // permite o front (Vite, porta 5173) chamar a API
app.use(express.json());  // lê o body JSON

app.use('/', authRoutes);               // POST /login, POST /logout
app.use('/produtos', produtosRoutes);   // CRUD protegido

module.exports = app;
