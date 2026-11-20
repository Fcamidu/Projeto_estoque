<script setup>
import { LIMITE_ESTOQUE_BAIXO } from '../constantes'

defineProps({ produto: { type: Object, required: true } })
defineEmits(['editar', 'excluir'])

const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <article class="card" :class="{ zerado: produto.quantidade === 0 }">
    <div class="card-topo">
      <span class="etiqueta">{{ produto.categoria }}</span>
      <span v-if="produto.quantidade === 0" class="selo esgotado">Esgotado</span>
      <span v-else-if="produto.quantidade <= LIMITE_ESTOQUE_BAIXO" class="selo baixo">Estoque baixo</span>
    </div>

    <h2 class="card-nome">{{ produto.nome }}</h2>
    <p class="card-fornecedor">{{ produto.fornecedor }}</p>

    <div class="card-numeros">
      <div>
        <strong class="qtd">{{ produto.quantidade }}</strong>
        <span>em estoque</span>
      </div>
      <div class="preco">
        <strong>{{ moeda(produto.preco) }}</strong>
        <span>total {{ moeda(produto.preco * produto.quantidade) }}</span>
      </div>
    </div>

    <div class="card-acoes">
      <button class="btn contorno pequeno" @click="$emit('editar', produto)">Editar</button>
      <button class="btn perigo pequeno" @click="$emit('excluir', produto)">Excluir</button>
    </div>
  </article>
</template>
