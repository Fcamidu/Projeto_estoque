<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import ProdutoForm from '../components/ProdutoForm.vue'
import ProdutoTabela from '../components/ProdutoTabela.vue'

const router = useRouter()
const auth = useAuthStore()

const produtos = ref([])
const editando = ref(null) // produto em edição (null = cadastro novo)
const formKey = ref(0)     // muda para "zerar" o formulário após salvar
const erro = ref('')

const mensagemDeErro = (e, padrao) => e.response?.data?.erro || padrao

async function carregar() {
  try {
    const { data } = await api.get('/produtos')       // READ
    produtos.value = data
  } catch (e) {
    erro.value = mensagemDeErro(e, 'Erro ao carregar produtos')
  }
}

async function salvar(dados) {
  erro.value = ''
  try {
    if (editando.value) await api.put(`/produtos/${editando.value.id}`, dados) // UPDATE
    else await api.post('/produtos', dados)                                    // CREATE
    editando.value = null
    formKey.value++
    await carregar()
  } catch (e) {
    erro.value = mensagemDeErro(e, 'Erro ao salvar produto')
  }
}

async function excluir(produto) {
  if (!confirm(`Excluir "${produto.nome}"?`)) return
  try {
    await api.delete(`/produtos/${produto.id}`)       // DELETE
    await carregar()
  } catch (e) {
    erro.value = mensagemDeErro(e, 'Erro ao excluir produto')
  }
}

async function sair() {
  await auth.logout()
  router.push('/login')
}

onMounted(carregar)
</script>

<template>
  <header class="topo">
    <h1>Gestão de Estoque</h1>
    <div>
      <span>Olá, {{ auth.usuario }}</span>
      <button class="secundario" @click="sair">Sair</button>
    </div>
  </header>

  <main class="layout">
    <p v-if="erro" class="erro">{{ erro }}</p>
    <ProdutoForm :key="formKey" :produto="editando" @salvar="salvar" @cancelar="editando = null" />
    <ProdutoTabela :produtos="produtos" @editar="editando = $event" @excluir="excluir" />
  </main>
</template>
