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
    erro.value = e.response?.data?.erro || 'Não foi possível conectar à API. Confira se o servidor está rodando.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="login-pagina">
    <section class="login-marca" aria-hidden="true">
      <p class="logo">Estoque</p>
      <p class="slogan">Controle total do estoque da sua loja gamer.</p>
      <div class="faixa"></div>
    </section>

    <main class="login-lado">
      <form class="login-form" @submit.prevent="entrar">
        <h1>Entrar</h1>
        <label>Usuário
          <input v-model="usuario" autocomplete="username" required autofocus />
        </label>
        <label>Senha
          <input v-model="senha" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="erro" class="alerta" role="alert">{{ erro }}</p>
        <button class="btn primario grande" :disabled="carregando">{{ carregando ? 'Entrando...' : 'Entrar' }}</button>
      </form>
    </main>
  </div>
</template>
