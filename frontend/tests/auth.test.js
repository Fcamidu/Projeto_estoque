import { describe, test, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// "Finge" a API: o teste de unidade não precisa do servidor rodando.
vi.mock('../src/services/api', () => ({
  default: {
    post: vi.fn(async (url) =>
      url === '/login' ? { data: { token: 'abc123', usuario: 'admin' } } : { data: {} },
    ),
  },
}))

import api from '../src/services/api'
import { useAuthStore } from '../src/stores/auth'

describe('store de autenticação (unitário)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  test('login guarda o token no estado e no localStorage', async () => {
    const auth = useAuthStore()
    await auth.login('admin', '123456')
    expect(auth.token).toBe('abc123')
    expect(localStorage.getItem('token')).toBe('abc123')
  })

  test('login ignora espaços nas pontas do usuário', async () => {
    const auth = useAuthStore()
    await auth.login('  admin ', '123456')
    expect(api.post).toHaveBeenCalledWith('/login', { usuario: 'admin', senha: '123456' })
  })

  test('logout limpa o token', async () => {
    const auth = useAuthStore()
    await auth.login('admin', '123456')
    await auth.logout()
    expect(auth.token).toBe('')
    expect(localStorage.getItem('token')).toBeNull()
  })
})
