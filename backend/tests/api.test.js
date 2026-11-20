const request = require('supertest');
const app = require('../app');
const Produto = require('../models/Produto');

// ---------- testes unitários (classe Produto) ----------
describe('Produto (unitário)', () => {
  const base = { id: 1, nome: 'Caneta', categoria: 'Outros', preco: 2.5, quantidade: 10, fornecedor: 'Bic' };

  test('calcula valor total do estoque', () => {
    expect(new Produto(base).valorTotalEstoque()).toBe(25);
  });

  test('detecta estoque baixo', () => {
    expect(new Produto({ ...base, quantidade: 2 }).estoqueBaixo()).toBe(true);
    expect(new Produto(base).estoqueBaixo()).toBe(false);
  });

  test('rejeita categoria fora da lista', () => {
    expect(() => new Produto({ ...base, categoria: 'Papelaria' })).toThrow();
  });

  test('rejeita preço e quantidade acima do limite', () => {
    expect(() => new Produto({ ...base, preco: 100000 })).toThrow();
    expect(() => new Produto({ ...base, quantidade: 100000 })).toThrow();
    expect(new Produto({ ...base, preco: 99999.99, quantidade: 99999 }).preco).toBe(99999.99);
  });

  test('rejeita nome muito longo', () => {
    expect(() => new Produto({ ...base, nome: 'x'.repeat(61) })).toThrow();
  });

  test('rejeita preço negativo', () => {
    expect(() => new Produto({ ...base, preco: -1 })).toThrow();
  });
});

// ---------- testes de integração (API) ----------
describe('API (integração)', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/login').send({ usuario: 'admin', senha: '123456' });
    token = res.body.token;
  });

  test('login válido devolve token', () => {
    expect(token).toBeDefined();
  });

  test('login inválido devolve 401', async () => {
    const res = await request(app).post('/login').send({ usuario: 'admin', senha: 'errada' });
    expect(res.status).toBe(401);
  });

  test('GET /produtos sem token devolve 401', async () => {
    const res = await request(app).get('/produtos');
    expect(res.status).toBe(401);
  });

  test('CRUD completo com token', async () => {
    const auth = { Authorization: `Bearer ${token}` };

    const criado = await request(app).post('/produtos').set(auth)
      .send({ nome: 'Webcam', categoria: 'Periféricos', preco: 199, quantidade: 7, fornecedor: 'TechParts' });
    expect(criado.status).toBe(201);
    const id = criado.body.id;

    const lista = await request(app).get('/produtos').set(auth);
    expect(lista.status).toBe(200);
    expect(lista.body.some((p) => p.id === id)).toBe(true);

    const editado = await request(app).put(`/produtos/${id}`).set(auth).send({ quantidade: 20 });
    expect(editado.status).toBe(200);
    expect(editado.body.quantidade).toBe(20);

    const excluido = await request(app).delete(`/produtos/${id}`).set(auth);
    expect(excluido.status).toBe(204);

    const depois = await request(app).get(`/produtos/${id}`).set(auth);
    expect(depois.status).toBe(404);
  });

  test('POST /produtos com categoria inválida devolve 400', async () => {
    const res = await request(app).post('/produtos').set({ Authorization: `Bearer ${token}` })
      .send({ nome: 'Caneta', categoria: 'Papelaria', preco: 2, quantidade: 1, fornecedor: 'Bic' });
    expect(res.status).toBe(400);
  });

  test('POST /produtos com preço acima do limite devolve 400', async () => {
    const res = await request(app).post('/produtos').set({ Authorization: `Bearer ${token}` })
      .send({ nome: 'Mouse', categoria: 'Periféricos', preco: 12344312412312312, quantidade: 1, fornecedor: 'Paulinho' });
    expect(res.status).toBe(400);
  });

  test('após logout o token deixa de funcionar', async () => {
    const login = await request(app).post('/login').send({ usuario: 'mateus', senha: 'senha123' });
    const t = login.body.token;
    await request(app).post('/logout').set('Authorization', `Bearer ${t}`);
    const res = await request(app).get('/produtos').set('Authorization', `Bearer ${t}`);
    expect(res.status).toBe(401);
  });
});
