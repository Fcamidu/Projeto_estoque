// Classe do objeto do tema "gestão de estoque".
// 7 propriedades: id, nome, categoria, preco, quantidade, fornecedor, dataCadastro
class Produto {
  #id;
  #nome;
  #categoria;
  #preco;
  #quantidade;
  #fornecedor;
  #dataCadastro;

  constructor({ id, nome, categoria, preco, quantidade, fornecedor, dataCadastro }) {
    this.#id = id;
    this.nome = nome; // usa os setters (com validação)
    this.categoria = categoria;
    this.preco = preco;
    this.quantidade = quantidade;
    this.fornecedor = fornecedor;
    this.#dataCadastro = dataCadastro || new Date().toISOString();
  }

  // ---------- getters ----------
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get categoria() { return this.#categoria; }
  get preco() { return this.#preco; }
  get quantidade() { return this.#quantidade; }
  get fornecedor() { return this.#fornecedor; }
  get dataCadastro() { return this.#dataCadastro; }

  // ---------- setters (com validação) ----------
  set nome(v) {
    if (typeof v !== 'string' || !v.trim()) throw new Error('nome é obrigatório');
    this.#nome = v.trim();
  }
  set categoria(v) {
    if (typeof v !== 'string' || !v.trim()) throw new Error('categoria é obrigatória');
    this.#categoria = v.trim();
  }
  set preco(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error('preco deve ser um número >= 0');
    this.#preco = n;
  }
  set quantidade(v) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0) throw new Error('quantidade deve ser um inteiro >= 0');
    this.#quantidade = n;
  }
  set fornecedor(v) {
    if (typeof v !== 'string' || !v.trim()) throw new Error('fornecedor é obrigatório');
    this.#fornecedor = v.trim();
  }

  // ---------- métodos ----------
  valorTotalEstoque() {
    return this.#preco * this.#quantidade;
  }

  estoqueBaixo(limite = 5) {
    return this.#quantidade <= limite;
  }

  // O Express usa isso ao fazer res.json(produto)
  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      categoria: this.#categoria,
      preco: this.#preco,
      quantidade: this.#quantidade,
      fornecedor: this.#fornecedor,
      dataCadastro: this.#dataCadastro,
    };
  }
}

module.exports = Produto;
