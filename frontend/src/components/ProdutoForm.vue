<script setup>
import { reactive, watch } from 'vue'
import { CATEGORIAS, LIMITES } from '../constantes'

// Recebe o produto em edição (ou null para cadastro novo)
const props = defineProps({
  produto: { type: Object, default: null },
  erro: { type: String, default: '' },
})
const emit = defineEmits(['salvar', 'cancelar'])

const vazio = { nome: '', categoria: '', preco: '', quantidade: '', fornecedor: '' }
const form = reactive({ ...vazio })

watch(() => props.produto, (p) => Object.assign(form, p ? { ...p } : vazio), { immediate: true })

function enviar() {
  emit('salvar', {
    nome: form.nome,
    categoria: form.categoria,
    preco: Number(form.preco),
    quantidade: Number(form.quantidade),
    fornecedor: form.fornecedor,
  })
}
</script>

<template>
  <form class="painel-form" @submit.prevent="enviar">
    <h2>{{ produto ? 'Editar produto' : 'Novo produto' }}</h2>
    <label>Nome <input v-model="form.nome" :maxlength="LIMITES.nomeMax" required autofocus /></label>
    <label>Categoria
      <select v-model="form.categoria" required>
        <option value="" disabled>Escolha uma categoria</option>
        <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
      </select>
    </label>
    <div class="duas-colunas">
      <label>Preço (R$) <input v-model="form.preco" type="number" min="0" :max="LIMITES.precoMax" step="0.01" required /></label>
      <label>Quantidade <input v-model="form.quantidade" type="number" min="0" :max="LIMITES.quantidadeMax" step="1" required /></label>
    </div>
    <label>Fornecedor <input v-model="form.fornecedor" :maxlength="LIMITES.fornecedorMax" required /></label>
    <p v-if="erro" class="alerta" role="alert">{{ erro }}</p>
    <div class="painel-acoes">
      <button type="button" class="btn contorno" @click="emit('cancelar')">Cancelar</button>
      <button type="submit" class="btn primario">{{ produto ? 'Salvar alterações' : 'Cadastrar produto' }}</button>
    </div>
  </form>
</template>
