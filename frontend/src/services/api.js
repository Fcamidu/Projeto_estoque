// Cliente axios único para toda a aplicação.
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000' })

// Antes de CADA requisição: se existir token guardado, envia no header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se a API responder 401 em uma rota protegida (token expirado/inválido),
// limpa a sessão e volta para o login. O /login em si é tratado na própria tela.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const urlDaRequisicao = error.config?.url || ''
    if (error.response?.status === 401 && !urlDaRequisicao.includes('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export default api
