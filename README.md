# Gestão de Estoque

Aplicação web de **gestão de estoque** (cadastro de Produtos) desenvolvida para a disciplina de **Desenvolvimento Web Avançado** (IFSP – Campus Cubatão).

- **Frontend:** Vue 3 (Vite, Vue Router, Pinia, axios)
- **Backend:** API RESTful com Node.js e Express
- **Autenticação:** login com token (`POST /login`); as rotas do CRUD respondem **401** sem token
- **Dados:** pré-cadastrados em memória (não há banco de dados; os dados voltam ao estado inicial quando o servidor reinicia)

## Estrutura do projeto

```
.
├── backend/
│   ├── app.js              # monta o Express (CORS, JSON, rotas)
│   ├── server.js           # sobe o servidor na porta 3000
│   ├── models/Produto.js   # classe Produto
│   ├── data/store.js       # usuários, produtos e tokens em memória
│   ├── middleware/auth.js  # valida o token (401 se ausente/inválido)
│   ├── routes/             # auth.js (login/logout) e produtos.js (CRUD)
│   └── tests/              # testes unitários e de integração (Jest + Supertest)
└── frontend/
    └── src/
        ├── views/          # Login.vue e Produtos.vue
        ├── components/     # ProdutoForm.vue e ProdutoTabela.vue
        ├── router/         # rotas e guarda de navegação
        ├── stores/auth.js  # estado de autenticação (Pinia)
        └── services/api.js # cliente axios (envia o token automaticamente)
```

## Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS) e npm

## Como rodar

Clone o repositório:

```bash
git clone <URL-DO-REPOSITORIO>
cd <NOME-DA-PASTA>
```

São necessários **dois terminais**, um para a API e outro para o frontend.

**1. Backend** (porta 3000)

```bash
cd backend
npm install
npm start
```

Deve aparecer: `API rodando em http://localhost:3000`

**2. Frontend** (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

> No PowerShell do Windows, se o `npm` for bloqueado por política de execução de scripts, rode uma vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## Usuários de teste

| Usuário | Senha |
|---|---|
| `admin` | `123456` |
| `mateus` | `senha123` |

## Classe Produto

| Propriedade | Tipo | Regra |
|---|---|---|
| `id` | número | gerado pela API |
| `nome` | texto | obrigatório |
| `categoria` | texto | obrigatória |
| `preco` | número | maior ou igual a 0 |
| `quantidade` | inteiro | maior ou igual a 0 |
| `fornecedor` | texto | obrigatório |
| `dataCadastro` | data ISO | preenchida na criação |

Possui construtor, getters, setters (com validação) e os métodos `valorTotalEstoque()` (preço × quantidade) e `estoqueBaixo(limite = 5)`.

## Rotas da API

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/login` | Não | Recebe `{ usuario, senha }` e devolve `{ token }` |
| POST | `/logout` | Sim | Invalida o token |
| GET | `/produtos` | Sim | Lista todos os produtos |
| GET | `/produtos/:id` | Sim | Busca um produto |
| POST | `/produtos` | Sim | Cria um produto |
| PUT | `/produtos/:id` | Sim | Atualiza um produto |
| DELETE | `/produtos/:id` | Sim | Exclui um produto |

As rotas protegidas exigem o header `Authorization: Bearer <token>`. Sem token (ou com token inválido) a resposta é **401**.

## Fluxo de autenticação

1. O frontend envia `POST /login` com usuário e senha.
2. A API valida, gera um token e o guarda em memória.
3. O frontend guarda o token no `localStorage` (e na store Pinia).
4. Um interceptor do axios adiciona `Authorization: Bearer <token>` em todas as requisições.
5. A guarda de rota do Vue Router redireciona para `/login` quando não há token.
6. No logout, o token é invalidado na API e removido do navegador.

## Testes

**Backend** (Jest + Supertest): testes unitários da classe `Produto` e de integração da API (login válido e inválido, 401 sem token, CRUD completo e token inválido após logout).

```bash
cd backend
npm test
```

**Frontend** (Vitest): testes unitários da store de autenticação.

```bash
cd frontend
npm test
```

### Teste manual do 401

Com a API rodando:

```bash
curl -i http://localhost:3000/produtos
```

A resposta deve ser `HTTP/1.1 401 Unauthorized`. No PowerShell, use `curl.exe` no lugar de `curl`, ou `Invoke-RestMethod`.

### Navegadores

A aplicação foi testada nos seguintes navegadores: *(preencher, por exemplo: Brave, Edge, Firefox)*.

## Autor

- Mateus Fcamidu Sousa — ADS, IFSP Campus Cubatão
