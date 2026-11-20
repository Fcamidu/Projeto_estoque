<script setup>
import { reactive, watch } from 'vue'

// Recebe o produto em edição (ou null para cadastro novo)
const props = defineProps({ produto: { type: Object, default: null } })
const emit = defineEmits(['salvar', 'cancelar'])

const vazio = { nome: '', categoria: '', preco: 0, quantidade: 0, fornecedor: '' }
const form = reactive({ ...vazio })

// Quando o pai troca o produto em edição, preenche o formulário.
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
  <form class="cartao form" @submit.prevent="enviar">
    <h2>{{ produto ? 'Editar produto' : 'Novo produto' }}</h2>
    <label>Nome <input v-model="form.nome" required /></label>
    <label>Categoria <input v-model="form.categoria" required /></label>
    <label>Preço (R$) <input v-model="form.preco" type="number" min="0" step="0.01" required /></label>
    <label>Quantidade <input v-model="form.quantidade" type="number" min="0" step="1" required /></label>
    <label>Fornecedor <input v-model="form.fornecedor" required /></label>
    <div class="acoes">
      <button type="submit">{{ produto ? 'Salvar alterações' : 'Cadastrar' }}</button>
      <button v-if="produto" type="button" class="secundario" @click="emit('cancelar')">Cancelar</button>
    </div>
  </form>
</template>
