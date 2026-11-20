<script setup>
defineProps({ produtos: { type: Array, required: true } })
defineEmits(['editar', 'excluir'])

const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <div class="cartao tabela">
    <h2>Produtos ({{ produtos.length }})</h2>
    <p v-if="!produtos.length" class="vazio">Nenhum produto cadastrado.</p>
    <table v-else>
      <thead>
        <tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Qtd</th><th>Fornecedor</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in produtos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.nome }}</td>
          <td>{{ p.categoria }}</td>
          <td>{{ moeda(p.preco) }}</td>
          <td :class="{ baixo: p.quantidade <= 5 }">{{ p.quantidade }}</td>
          <td>{{ p.fornecedor }}</td>
          <td class="acoes">
            <button class="secundario" @click="$emit('editar', p)">Editar</button>
            <button class="perigo" @click="$emit('excluir', p)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="dica">Quantidade em vermelho = estoque baixo (5 ou menos).</p>
  </div>
</template>
