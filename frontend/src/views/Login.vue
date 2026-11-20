<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const usuario = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function entrar() {
  erro.value = ''
  carregando.value = true
  try {
    await auth.login(usuario.value, senha.value)
    router.push('/produtos')
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Não foi possível conectar à API'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <main class="centro">
    <form class="cartao login" @submit.prevent="entrar">
      <h1>Gestão de Estoque</h1>
      <label>Usuário
        <input v-model="usuario" autocomplete="username" required />
      </label>
      <label>Senha
        <input v-model="senha" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="erro" class="erro">{{ erro }}</p>
      <button :disabled="carregando">{{ carregando ? 'Entrando...' : 'Entrar' }}</button>
    </form>
  </main>
</template>
