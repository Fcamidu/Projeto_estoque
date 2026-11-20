// Store Pinia: guarda token e usuário (também no localStorage, para
// a sessão sobreviver a um F5).
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const usuario = ref(localStorage.getItem('usuario') || '')

  async function login(user, senha) {
    const { data } = await api.post('/login', { usuario: user.trim(), senha }) // trim: ignora espaços sem querer no usuário
    token.value = data.token
    usuario.value = data.usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', data.usuario)
  }

  async function logout() {
    try {
      await api.post('/logout') // invalida o token no servidor
    } catch {
      /* mesmo se falhar, limpamos o lado do cliente */
    }
    token.value = ''
    usuario.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return { token, usuario, login, logout }
})
