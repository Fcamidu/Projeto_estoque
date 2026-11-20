// Mesma lista de categorias do backend (models/Produto.js)
export const CATEGORIAS = ['Periféricos', 'Monitores', 'Cabos', 'Componentes', 'Armazenamento', 'Redes', 'Acessórios', 'Outros']

// Quantidade igual ou abaixo disso é considerada estoque baixo
export const LIMITE_ESTOQUE_BAIXO = 5

// Limites dos campos (mesmos valores do backend, em models/Produto.js)
export const LIMITES = { precoMax: 99999.99, quantidadeMax: 99999, nomeMax: 60, fornecedorMax: 40 }
