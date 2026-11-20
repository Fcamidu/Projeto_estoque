<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { CATEGORIAS, LIMITE_ESTOQUE_BAIXO } from '../constantes'
import ProdutoForm from '../components/ProdutoForm.vue'
import ProdutoCard from '../components/ProdutoCard.vue'

const router = useRouter()
const auth = useAuthStore()

const produtos = ref([])
const editando = ref(null)        // produto em edição (null = cadastro novo)
const painelAberto = ref(false)
const erro = ref('')              // erro da tela
const erroForm = ref('')          // erro mostrado dentro do painel
const aviso = ref('')
const busca = ref('')
const categoriaFiltro = ref('')   // '' = todas
let timerAviso

const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return produtos.value.filter((p) =>
    (!categoriaFiltro.value || p.categoria === categoriaFiltro.value) &&
    (!q || p.nome.toLowerCase().includes(q) || p.fornecedor.toLowerCase().includes(q)),
  )
})
const valorEmEstoque = computed(() => produtos.value.reduce((s, p) => s + p.preco * p.quantidade, 0))
const qtdBaixos = computed(() => produtos.value.filter((p) => p.quantidade <= LIMITE_ESTOQUE_BAIXO).length)
const faixaTopo = computed(() =>
  qtdBaixos.value
    ? `Atenção: ${qtdBaixos.value} ${qtdBaixos.value === 1 ? 'produto está' : 'produtos estão'} com estoque baixo`
    : 'Estoque em dia: nenhum produto com estoque baixo',
)

function avisar(msg) {
  aviso.value = msg
  clearTimeout(timerAviso)
  timerAviso = setTimeout(() => (aviso.value = ''), 3000)
}

function abrirNovo() { editando.value = null; erroForm.value = ''; painelAberto.value = true }
function abrirEdicao(p) { editando.value = p; erroForm.value = ''; painelAberto.value = true }
function fechar() { painelAberto.value = false }

async function carregar() {
  try {
    const { data } = await api.get('/produtos')                      // READ
    produtos.value = data
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Erro ao carregar os produtos'
  }
}

async function salvar(dados) {
  erroForm.value = ''
  try {
    if (editando.value) {
      await api.put(`/produtos/${editando.value.id}`, dados)         // UPDATE
      avisar('Alterações salvas')
    } else {
      await api.post('/produtos', dados)                             // CREATE
      avisar('Produto cadastrado')
    }
    fechar()
    await carregar()
  } catch (e) {
    erroForm.value = e.response?.data?.erro || 'Não foi possível salvar o produto'
  }
}

async function excluir(produto) {
  if (!confirm(`Excluir "${produto.nome}"?`)) return
  try {
    await api.delete(`/produtos/${produto.id}`)                      // DELETE
    avisar('Produto excluído')
    await carregar()
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Erro ao excluir o produto'
  }
}

async function sair() {
  await auth.logout()
  router.push('/login')
}

const aoTeclar = (e) => { if (e.key === 'Escape') fechar() }
onMounted(() => { carregar(); window.addEventListener('keydown', aoTeclar) })
onUnmounted(() => window.removeEventListener('keydown', aoTeclar))
</script>

<template>
  <p class="faixa-topo" :class="{ alerta: qtdBaixos > 0 }">{{ faixaTopo }}</p>

  <header class="topo">
    <span class="topo-marca"><i class="marca-ico"></i>Estoque</span>
    <div class="topo-usuario">
      <span>{{ auth.usuario }}</span>
      <button class="btn contorno pequeno" @click="sair">Sair</button>
    </div>
  </header>

  <main class="pagina">
    <section class="hero">
      <div class="hero-texto">
        <h1>Painel do estoque</h1>
        <p>Cadastre, acompanhe e reponha os produtos da loja.</p>
      </div>
      <div class="hero-numeros">
        <div><strong>{{ produtos.length }}</strong><span>produtos</span></div>
        <div><strong>{{ moeda(valorEmEstoque) }}</strong><span>em estoque</span></div>
        <div :class="{ atencao: qtdBaixos > 0 }"><strong>{{ qtdBaixos }}</strong><span>com estoque baixo</span></div>
      </div>
    </section>

    <p v-if="erro" class="alerta" role="alert">{{ erro }}</p>
    <p v-if="aviso" class="aviso" role="status">{{ aviso }}</p>

    <nav class="chips" aria-label="Filtrar por categoria">
      <button class="chip" :class="{ ativo: categoriaFiltro === '' }" :aria-pressed="categoriaFiltro === ''" @click="categoriaFiltro = ''">Todos</button>
      <button v-for="c in CATEGORIAS" :key="c" class="chip" :class="{ ativo: categoriaFiltro === c }" :aria-pressed="categoriaFiltro === c" @click="categoriaFiltro = c">{{ c }}</button>
    </nav>

    <div class="barra">
      <input v-model="busca" type="search" placeholder="Buscar por nome ou fornecedor" aria-label="Buscar produtos" />
      <button class="btn primario" @click="abrirNovo">Novo produto</button>
    </div>

    <section v-if="visiveis.length" class="vitrine" aria-label="Produtos">
      <ProdutoCard v-for="p in visiveis" :key="p.id" :produto="p" @editar="abrirEdicao" @excluir="excluir" />
    </section>
    <p v-else-if="produtos.length" class="vazio">Nenhum produto encontrado. Limpe a busca ou escolha outra categoria.</p>
    <p v-else class="vazio">Nenhum produto cadastrado. Use “Novo produto” para adicionar o primeiro.</p>
  </main>

  <div v-if="painelAberto" class="cortina" @click.self="fechar">
    <aside class="painel" role="dialog" aria-modal="true" aria-label="Formulário de produto">
      <ProdutoForm :produto="editando" :erro="erroForm" @salvar="salvar" @cancelar="fechar" />
    </aside>
  </div>
</template>
