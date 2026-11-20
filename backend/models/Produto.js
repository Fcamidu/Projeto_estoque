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

  // Categorias permitidas (o front usa a mesma lista no <select>)
  static CATEGORIAS = ['Periféricos', 'Monitores', 'Cabos', 'Componentes', 'Armazenamento', 'Redes', 'Acessórios', 'Outros'];

  // Limites aceitos (o front usa os mesmos valores nos campos do formulário)
  static LIMITES = { precoMax: 99999.99, quantidadeMax: 99999, nomeMax: 60, fornecedorMax: 40 };

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
    if (v.trim().length > Produto.LIMITES.nomeMax) throw new Error(`nome deve ter no máximo ${Produto.LIMITES.nomeMax} caracteres`);
    this.#nome = v.trim();
  }
  set categoria(v) {
    if (!Produto.CATEGORIAS.includes(v)) {
      throw new Error(`categoria inválida. Use uma de: ${Produto.CATEGORIAS.join(', ')}`);
    }
    this.#categoria = v;
  }
  set preco(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error('preco deve ser um número >= 0');
    if (n > Produto.LIMITES.precoMax) throw new Error('preco deve ser no máximo R$ 99.999,99');
    this.#preco = Math.round(n * 100) / 100; // 2 casas decimais
  }
  set quantidade(v) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0) throw new Error('quantidade deve ser um inteiro >= 0');
    if (n > Produto.LIMITES.quantidadeMax) throw new Error('quantidade deve ser no máximo 99.999');
    this.#quantidade = n;
  }
  set fornecedor(v) {
    if (typeof v !== 'string' || !v.trim()) throw new Error('fornecedor é obrigatório');
    if (v.trim().length > Produto.LIMITES.fornecedorMax) throw new Error(`fornecedor deve ter no máximo ${Produto.LIMITES.fornecedorMax} caracteres`);
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
