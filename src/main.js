import './style.css'
import NAME_CN from './pokemon_names_cn.json'

const API_BASE = 'https://pokeapi.co/api/v2/pokemon'
const SPECIES_BASE = 'https://pokeapi.co/api/v2/pokemon-species'
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

// Pokemon whose default artwork is less recognizable; map to a better form's ID
const SPRITE_OVERRIDE = { 964: 10256 } // palafin: zero → hero

const TYPE_NAMES_CN = {
  normal: '一般', fire: '火', water: '水', electric: '电',
  grass: '草', ice: '冰', fighting: '格斗', poison: '毒',
  ground: '地面', flying: '飞行', psychic: '超能力', bug: '虫',
  rock: '岩石', ghost: '幽灵', dragon: '龙', steel: '钢',
  fairy: '妖精', dark: '恶',
}

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0',
  electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
  fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
  flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
  steel: '#B8B8D0', fairy: '#EE99AC', dark: '#705848',
}

const TYPE_ICONS = {
  normal: '⬡', fire: '🔥', water: '💧', electric: '⚡',
  grass: '🌱', ice: '❄️', fighting: '💪', poison: '💀',
  ground: '⛰️', flying: '🪶', psychic: '🔮', bug: '🐛',
  rock: '🪨', ghost: '👻', dragon: '🐉', steel: '⚙️',
  fairy: '✨',
}

const DAMAGE_CLASS_CN = {
  physical: '物攻',
  special: '特攻',
  status: '变化',
}

const STAT_CN = {
  hp: 'HP', attack: '攻击', defense: '防御',
  'special-attack': '特攻', 'special-defense': '特防', speed: '速度',
}
const STAT_COLORS = {
  hp: '#22c55e', attack: '#ef4444', defense: '#f59e0b',
  'special-attack': '#3b82f6', 'special-defense': '#06b6d4', speed: '#ec4899',
}

// Nature data for competitive recommendations
const NATURE_CN = {
  hardy: '勤奋', lonely: '怕寂寞', brave: '勇敢', adamant: '固执', naughty: '顽皮',
  bold: '大胆', docile: '坦率', relaxed: '悠闲', impish: '淘气', lax: '乐天',
  timid: '胆小', hasty: '急躁', serious: '认真', jolly: '爽朗', naive: '天真',
  modest: '内敛', mild: '慢吞吞', quiet: '冷静', bashful: '害羞', rash: '马虎',
  calm: '温和', gentle: '温顺', sassy: '自大', careful: '慎重', quirky: '浮躁',
}
const NATURE_STATS = {
  hardy: [null, null], lonely: ['attack', 'defense'], brave: ['attack', 'speed'],
  adamant: ['attack', 'special-attack'], naughty: ['attack', 'special-defense'],
  bold: ['defense', 'attack'], docile: [null, null],
  relaxed: ['defense', 'speed'], impish: ['defense', 'special-attack'],
  lax: ['defense', 'special-defense'],
  timid: ['speed', 'attack'], hasty: ['speed', 'defense'], serious: [null, null],
  jolly: ['speed', 'special-attack'], naive: ['speed', 'special-defense'],
  modest: ['special-attack', 'attack'], mild: ['special-attack', 'defense'],
  quiet: ['special-attack', 'speed'], bashful: [null, null],
  rash: ['special-attack', 'special-defense'],
  calm: ['special-defense', 'attack'], gentle: ['special-defense', 'defense'],
  sassy: ['special-defense', 'speed'], careful: ['special-defense', 'special-attack'],
  quirky: [null, null],
}
function recommendNatures(stats) {
  const m = {}
  stats.forEach(s => m[s.stat.name] = s.base_stat)
  const atk = m.attack || 0; const spa = m['special-attack'] || 0; const spe = m.speed || 0
  // Trick Room — very slow
  if (spe <= 30 && (atk >= 80 || spa >= 80)) return atk >= spa ? ['brave', 'relaxed'] : ['quiet', 'sassy']
  // Physical attacker
  if (atk > spa + 10 || (atk >= 80 && spa < 65)) return spe >= 70 ? ['adamant', 'jolly'] : ['adamant', 'brave']
  // Special attacker
  if (spa > atk + 10 || (spa >= 80 && atk < 65)) return spe >= 70 ? ['modest', 'timid'] : ['modest', 'quiet']
  // Mixed
  return spe >= 70 ? ['naive', 'hasty'] : ['rash', 'naughty']
}

const FORM_CN = {
  alola: '阿罗拉', galar: '伽勒尔', hisui: '洗翠',
  paldea: '帕底亚', mega: 'Mega', 'mega-x': 'Mega-X',
  'mega-y': 'Mega-Y', gmax: '极巨化', eternamax: '无极巨化',
  primal: '原始回归', origin: '起源', ultra: '究极',
  therian: '灵兽', totem: '霸主', dusk: '黑夜',
  midnight: '黑夜', midday: '白昼', dawn: '拂晓',
  attack: '攻击', defense: '防御', speed: '速度',
  plant: '草木', sandy: '沙地', trash: '垃圾',
  sky: '天空', land: '陆地', zen: '达摩',
  unbound: '解放', ash: '小智版', noice: '无冰',
  'crowned-sword': '剑之王', 'crowned-shield': '盾之王',
  'ice-rider': '冰骑', 'shadow-rider': '幽灵骑',
  bloodmoon: '血月', resolute: '觉悟',
  'dusk-mane': '黄昏之鬃', 'dawn-wings': '拂晓之翼',
  incarnate: '化身', starter: '初始', partner: '搭档',
  'teal-mask': '碧草面具', 'wellspring-mask': '水井面具',
  'hearthflame-mask': '火灶面具', 'cornerstone-mask': '基石面具',
  'family-of-four': '四口', 'family-of-three': '三口',
  zero: '平凡', hero: '终极',
  aria: '歌声', pirouette: '旋转',
  ordinary: '通常',
  'red-striped': '红纹', 'blue-striped': '蓝纹', 'white-striped': '白纹',
  amped: '高调', 'low-key': '低调',
  'full-belly': '满腹', hangry: '空腹',
  disguised: '化形', busted: '现形',
  curly: '上翘', droopy: '下垂', stretchy: '平挺',
  phony: '仿冒', antique: '古董',
  'green-plumage': '绿羽', 'blue-plumage': '蓝羽',
  'yellow-plumage': '黄羽', 'white-plumage': '白羽',
  eternal: '永恒', gulping: '吞上', gorging: '吞下',
  'complete': '完全体', '50': '５０％', '10': '１０％',
  '100': '１００％', 'black': '黑色', 'white': '白色',
  // Pikachu forms
  'rock-star': '摇滚', belle: '贵妇', 'pop-star': '流行',
  phd: '博士', libre: '摔角', cosplay: '换装',
  'original-cap': '初始帽子', 'hoenn-cap': '丰缘帽子',
  'sinnoh-cap': '神奥帽子', 'unova-cap': '合众帽子',
  'kalos-cap': '卡洛斯帽子', 'alola-cap': '阿罗拉帽子',
  'partner-cap': '搭档帽子', 'world-cap': '世界帽子',
}

const FORM_CN_SUFFIX = new Set(['mega', 'mega-x', 'mega-y', 'gmax', 'eternamax',
  'rock-star', 'belle', 'pop-star', 'phd', 'libre', 'cosplay',
  'original-cap', 'hoenn-cap', 'sinnoh-cap', 'unova-cap', 'kalos-cap',
  'alola-cap', 'partner-cap', 'world-cap', 'partner', 'starter'])

function formatRegionalName(rawName, baseChineseName) {
  if (/[一-鿿]/.test(rawName)) return rawName
  const parts = rawName.split('-')
  if (parts.length > 1) {
    const formParts = parts.slice(1)
    // Try full compound key first (e.g. "mega-x", "rock-star")
    const fullKey = formParts.join('-').toLowerCase()
    const fullCn = FORM_CN[fullKey]
    if (fullCn && baseChineseName) {
      if (FORM_CN_SUFFIX.has(fullKey)) return `${baseChineseName}-${fullCn}`
      return `${fullCn} ${baseChineseName}`
    }
    // Try matching individual parts from right to left (e.g. "totem-alola" → "阿罗拉 霸主")
    const matched = []
    let remaining = [...formParts]
    while (remaining.length > 0) {
      let found = false
      for (let i = remaining.length; i > 0; i--) {
        const key = remaining.slice(0, i).join('-').toLowerCase()
        const cn = FORM_CN[key]
        if (cn) {
          matched.unshift(cn)
          remaining = remaining.slice(i)
          found = true
          break
        }
      }
      if (!found) break
    }
    if (matched.length > 0 && baseChineseName) {
      return matched.join(' ') + ' ' + baseChineseName
    }
  }
  return null
}

const GENERATIONS = [
  { id: 1, name: '第一世代', label: 'KANTO', range: [1, 151] },
  { id: 2, name: '第二世代', label: 'JOHTO', range: [152, 251] },
  { id: 3, name: '第三世代', label: 'HOENN', range: [252, 386] },
  { id: 4, name: '第四世代', label: 'SINNOH', range: [387, 493] },
  { id: 5, name: '第五世代', label: 'UNOVA', range: [494, 649] },
  { id: 6, name: '第六世代', label: 'KALOS', range: [650, 721] },
  { id: 7, name: '第七世代', label: 'ALOLA', range: [722, 809] },
  { id: 8, name: '第八世代', label: 'GALAR', range: [810, 905] },
  { id: 9, name: '第九世代', label: 'PALDEA', range: [906, 1025] },
]

let allPokemonBasic = []
let pokemonList = []
let currentOffset = 0
let totalCount = 0
const PAGE_SIZE = 20
let isLoading = false
let searchActive = false
let selectedGen = null
let selectedId = null
let _varietyCycle = []
let _currentFlavorText = ''
let currentTheme = localStorage.getItem('pokedex_theme') || 'dark'

const app = document.querySelector('#app')

/* ───────── API ───────── */

async function fetchAllPokemon() {
  const res = await fetch(`${API_BASE}?limit=100000&offset=0`)
  const data = await res.json()
  return data.results.map(p => {
    const segments = p.url.replace(/\/$/, '').split('/')
    const id = parseInt(segments[segments.length - 1])
    return { id, name: p.name, url: p.url, image: `${SPRITE_BASE}/${SPRITE_OVERRIDE[id] || id}.png`, nameCn: NAME_CN[p.name] || '' }
  })
}

let chineseNameReady = false
async function prefetchAllChineseNames() {
  const BATCH = 20
  for (let i = 0; i < allPokemonBasic.length; i += BATCH) {
    const batch = allPokemonBasic.slice(i, i + BATCH)
    await Promise.allSettled(
      batch.map(p =>
        fetch(`${SPECIES_BASE}/${p.id}/`)
          .then(r => r.json())
          .then(s => {
            const cn = s.names.find(n => n.language.name === 'zh-hans')
            if (cn) p.nameCn = cn.name
          })
          .catch(() => {})
      )
    )
  }
  chineseNameReady = true
}

async function fetchPokemonPage(offset) {
  const res = await fetch(`${API_BASE}?limit=${PAGE_SIZE}&offset=${offset}`)
  const data = await res.json()
  totalCount = data.count

  const basic = data.results.map(p => {
    const segments = p.url.replace(/\/$/, '').split('/')
    const id = parseInt(segments[segments.length - 1])
    return { id, name: p.name, url: p.url, image: `${SPRITE_BASE}/${SPRITE_OVERRIDE[id] || id}.png`, nameCn: NAME_CN[p.name] || p.name }
  })

  const speciesResults = await Promise.allSettled(
    basic.map(p =>
      fetch(`${SPECIES_BASE}/${p.id}/`)
        .then(r => r.json())
        .then(s => {
          const cn = s.names.find(n => n.language.name === 'zh-hans')
          return { id: p.id, nameCn: cn ? cn.name : basic.find(b => b.id === p.id)?.name || p.name }
        })
    )
  )
  speciesResults.forEach((r, i) => { if (r.status === 'fulfilled') basic[i].nameCn = r.value.nameCn })
  return basic
}

/* ───────── Render ───────── */

function render() {
  app.className = currentTheme === 'switch' ? 'theme-switch' : currentTheme === 'joycon' ? 'theme-joycon' : ''

  const currentPage = Math.floor(currentOffset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1
  const hasMore = currentOffset + PAGE_SIZE < totalCount
  const hasPrev = currentOffset > 0

  app.innerHTML = `
    <div class="app-layout">

      <!-- ═══ Sidebar ═══ -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="pokeball-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" fill="white" stroke="#333" stroke-width="5"/>
              <path d="M6 50 A44 44 0 0 1 94 50" fill="#e60012"/>
              <line x1="6" y1="50" x2="94" y2="50" stroke="#333" stroke-width="5"/>
              <circle cx="50" cy="50" r="14" fill="white" stroke="#333" stroke-width="4"/>
              <circle cx="50" cy="50" r="6" fill="#333"/>
            </svg>
          </div>
          <div class="pokemon-logo">
            <svg viewBox="0 0 240 50" width="160" xmlns="http://www.w3.org/2000/svg">
              <text x="120" y="38" text-anchor="middle" font-family="'Arial Black','Impact',sans-serif" font-size="34" font-weight="900" fill="#FFCC00" stroke="#2a3a8a" stroke-width="3" paint-order="stroke">POKÉMON</text>
            </svg>
          </div>
        </div>
        <nav class="sidebar-nav" id="genNav">
          <button class="gen-btn ${!selectedGen ? 'active' : ''}" data-gen="all">
            <span class="gen-dot ${!selectedGen ? 'active' : ''}"></span>
            全部图鉴
          </button>
          <div class="gen-section">
            <div class="gen-section-header" id="genSectionToggle">
              <span class="gen-section-title">各世代</span>
              <span class="gen-section-arrow" id="genSectionArrow">▾</span>
            </div>
            <div class="gen-section-body" id="genSectionBody">
              ${GENERATIONS.map(g => `
                <button class="gen-btn ${selectedGen === g.id ? 'active' : ''}" data-gen="${g.id}">
                  <span class="gen-dot ${selectedGen === g.id ? 'active' : ''}"></span>
                  <span>${g.name}</span>
                  <span class="gen-label">${g.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="theme-section">
            <div class="theme-section-header" id="themeToggle">
              <span class="theme-section-title">主题外观</span>
              <span class="theme-section-arrow" id="themeArrow">▾</span>
            </div>
            <div class="theme-section-body" id="themeBody">
              <button class="theme-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                <span class="theme-dot" style="background:#070810;border-color:#475569;">🌙</span>
                <span>深色外观</span>
              </button>
              <button class="theme-btn ${currentTheme === 'switch' ? 'active' : ''}" data-theme="switch">
                <span class="theme-dot" style="background:#ecedec;border-color:#e60012;">☀</span>
                <span>Switch经典</span>
              </button>
              <button class="theme-btn ${currentTheme === 'joycon' ? 'active' : ''}" data-theme="joycon">
                <span class="theme-dot" style="background:#e60012;border-color:#0B6AB5;">🎮</span>
                <span>Joy-Con</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- ═══ Main ═══ -->
      <div class="main-area">

        <!-- top bar -->
        <header class="top-bar">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" id="searchInput" placeholder="搜索名称或编号..." />
            <button id="clearSearch" class="search-clear">✕</button>
          </div>
        </header>

        <div class="content-split">

          <!-- left panel -->
          <div class="left-panel">

            <div id="searchMeta" class="search-meta hidden" style="display:none;"><p></p></div>

            <div id="loading" class="loading-state hidden" style="display:none;">
              <div class="loading-spinner"></div>
            </div>

            <div class="card-area" id="cardArea">
              <div id="cardDeck" class="card-grid"></div>
              <div id="emptyState" class="empty-state hidden" style="display:none;">
                <div class="empty-icon">🔍</div>
                <p>NOT FOUND</p>
                <p style="font-size:10px;color:#334155;margin:4px 0 0;">try another keyword</p>
              </div>
            </div>

            <div id="pagination" class="pagination-bar hidden" style="display:none;">
              <button id="prevBtn" ${!hasPrev ? 'disabled' : ''}>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                PREV
              </button>
              <span class="page-info" id="pageInfo">${totalCount > 0 ? `${String(currentPage).padStart(2, '0')}/${String(totalPages).padStart(2, '0')}` : ''}</span>
              <div class="page-jump-wrap">
                <label>GO</label>
                <input id="pageJump" type="number" min="1" max="${totalPages}" value="${currentPage}" class="page-jump" />
              </div>
              <button id="nextBtn" ${!hasMore ? 'disabled' : ''}>
                NEXT
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div class="pokedex-footer" style="padding:4px 10px;text-align:center;border-top:1px solid rgba(99,102,241,0.06);flex-shrink:0;">
              <p style="font-size:8px;font-family:monospace;color:#1e293b;margin:0;">POKéAPI &bull; ${totalCount || '?'} SPECIES</p>
            </div>
          </div>

          <!-- right panel -->
          <div class="right-panel" id="detailPanel">
            <div class="detail-placeholder" id="detailPlaceholder">
              <div class="dp-icon">
                <svg viewBox="0 0 100 100" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="white" stroke="#333" stroke-width="4"/>
                  <path d="M6 50 A44 44 0 0 1 94 50" fill="#e60012"/>
                  <line x1="6" y1="50" x2="94" y2="50" stroke="#333" stroke-width="4"/>
                  <circle cx="50" cy="50" r="12" fill="white" stroke="#333" stroke-width="3"/>
                  <circle cx="50" cy="50" r="5" fill="#333"/>
                </svg>
              </div>
              <p>选择一只宝可梦查看详情</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div id="floatTooltip" class="hidden" style="display:none;"></div>
  `

  /* ── event binding ── */
  document.getElementById('searchInput').addEventListener('input', onSearch)
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.target.value = ''; onSearch(); e.target.blur() }
  })
  document.getElementById('clearSearch')?.addEventListener('click', () => {
    document.getElementById('searchInput').value = ''; onSearch()
  })

  document.querySelectorAll('.gen-btn').forEach(btn => {
    btn.addEventListener('click', () => selectGeneration(btn.dataset.gen === 'all' ? null : parseInt(btn.dataset.gen)))
  })

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme))
  })

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const body = document.getElementById('themeBody')
    const arrow = document.getElementById('themeArrow')
    if (!body) return
    const isHidden = body.style.display === 'none'
    body.style.display = isHidden ? 'flex' : 'none'
    if (arrow) arrow.textContent = isHidden ? '▾' : '▸'
  })

  document.getElementById('genSectionToggle')?.addEventListener('click', () => {
    const body = document.getElementById('genSectionBody')
    const arrow = document.getElementById('genSectionArrow')
    if (!body) return
    const isHidden = body.style.display === 'none'
    body.style.display = isHidden ? 'flex' : 'none'
    if (arrow) arrow.textContent = isHidden ? '▾' : '▸'
  })

  document.getElementById('prevBtn')?.addEventListener('click', () => goToPage(currentOffset - PAGE_SIZE))
  document.getElementById('nextBtn')?.addEventListener('click', () => goToPage(currentOffset + PAGE_SIZE))
  document.getElementById('pageJump')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const page = parseInt(e.target.value)
      const tp = Math.ceil(totalCount / PAGE_SIZE)
      if (!isNaN(page) && page >= 1 && page <= tp) {
        document.getElementById('searchInput').value = ''
        searchActive = false
        goToPage((page - 1) * PAGE_SIZE)
      }
    }
  })

  init()
}

async function init() {
  const loading = document.getElementById('loading')
  try {
    allPokemonBasic = await fetchAllPokemon()
    prefetchAllChineseNames()
    await loadPage(0)
  } catch {
    loading.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;"><span style="font-size:24px;">⚠️</span><p style="color:#f87171;font-size:12px;font-family:monospace;">CONNECTION ERROR</p><button onclick="location.reload()" style="padding:6px 16px;border-radius:8px;background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.2);font-size:11px;font-family:monospace;cursor:pointer;">RETRY</button></div>`
  }
}

async function loadPage(offset) {
  const loading = document.getElementById('loading')
  const deck = document.getElementById('cardDeck')
  const emptyState = document.getElementById('emptyState')
  const pagination = document.getElementById('pagination')
  const searchInput = document.getElementById('searchInput')
  if (!loading || !deck) return

  isLoading = true
  loading.style.display = 'flex'
  deck.style.display = 'none'
  emptyState.style.display = 'none'
  pagination.style.display = 'none'

  try {
    let list

    if (selectedGen) {
      const gen = GENERATIONS.find(g => g.id === selectedGen)
      const pool = allPokemonBasic.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1])
      totalCount = pool.length
      const slice = pool.slice(offset, offset + PAGE_SIZE)

      const speciesResults = await Promise.allSettled(
        slice.map(p =>
          fetch(`${SPECIES_BASE}/${p.id}/`).then(r => r.json()).then(s => {
            const cn = s.names.find(n => n.language.name === 'zh-hans')
            return { id: p.id, nameCn: cn ? cn.name : p.name }
          })
        )
      )
      list = slice.map((p, i) => ({
        ...p,
        nameCn: speciesResults[i]?.status === 'fulfilled' ? speciesResults[i].value.nameCn : p.name,
      }))
    } else {
      list = await fetchPokemonPage(offset)
    }

    pokemonList = list
    currentOffset = offset
    loading.style.display = 'none'

    // preload card images in background (non-blocking)
    setTimeout(() => {
      list.forEach(p => { const i = new Image(); i.src = p.image })
    }, 50)

    const q = searchInput ? searchInput.value.trim() : ''
    if (q) renderSearchResults(q)
    else { searchActive = false; renderDeck(pokemonList); updatePagination() }
  } catch {
    loading.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;"><span style="font-size:24px;">⚠️</span><p style="color:#f87171;font-size:12px;font-family:monospace;">CONNECTION ERROR</p><button onclick="location.reload()" style="padding:6px 16px;border-radius:8px;background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.2);font-size:11px;font-family:monospace;cursor:pointer;">RETRY</button></div>`
  }
  isLoading = false
}

function renderDeck(list) {
  const deck = document.getElementById('cardDeck')
  const emptyState = document.getElementById('emptyState')
  const pagination = document.getElementById('pagination')
  const searchMeta = document.getElementById('searchMeta')

  if (searchMeta) searchMeta.style.display = 'none'

  if (list.length === 0) {
    deck.style.display = 'none'; emptyState.style.display = 'flex'; pagination.style.display = 'none'
    return
  }

  emptyState.style.display = 'none'
  deck.style.display = 'grid'
  deck.innerHTML = list.map(p => {
    // fetch type colors for preview badges (use basic type colors based on id)
    return `
      <div class="preview-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.nameCn || p.name}" loading="lazy" />
        <div class="pcard-num">#${String(p.id).padStart(3, '0')}</div>
        <div class="pcard-name">${p.nameCn || p.name}</div>
      </div>
    `
  }).join('')

  deck.querySelectorAll('.preview-card').forEach(card => {
    card.addEventListener('click', () => showDetail(parseInt(card.dataset.id)))
  })

  // highlight selected card
  if (selectedId) {
    deck.querySelector(`.preview-card[data-id="${selectedId}"]`)?.classList.add('selected')
  }
}

function updatePagination() {
  const pagination = document.getElementById('pagination')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  const pageInfo = document.getElementById('pageInfo')
  if (!pagination) return

  const currentPage = Math.floor(currentOffset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  if (pageInfo) pageInfo.textContent = totalCount > 0 ? `${String(currentPage).padStart(2, '0')}/${String(totalPages).padStart(2, '0')}` : ''

  if (prevBtn) prevBtn.disabled = !(currentOffset > 0)
  if (nextBtn) nextBtn.disabled = !(currentOffset + PAGE_SIZE < totalCount)

  const pageJump = document.getElementById('pageJump')
  if (pageJump) { pageJump.value = currentPage; pageJump.max = totalPages || 1 }

  pagination.style.display = 'flex'
}

function renderSearchResults(q) {
  const lower = q.toLowerCase()
  const num = parseInt(lower)

  let pool = allPokemonBasic
  if (selectedGen) {
    const gen = GENERATIONS.find(g => g.id === selectedGen)
    pool = pool.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1])
  }

  const results = pool.filter(p => p.name.includes(lower) || (p.nameCn && p.nameCn.includes(lower)) || (!isNaN(num) && p.id === num))

  const searchMeta = document.getElementById('searchMeta')
  if (searchMeta) {
    searchMeta.style.display = 'block'
    searchMeta.querySelector('p').textContent = results.length > 0 ? `> ${results.length} RESULTS` : '> NO MATCH'
  }
  document.getElementById('pagination').style.display = 'none'
  renderDeck(results)
}

async function goToPage(offset) {
  if (isLoading) return
  currentOffset = Math.max(0, offset)
  const searchInput = document.getElementById('searchInput')
  if (searchInput) searchInput.value = ''
  searchActive = false
  await loadPage(currentOffset)
}

/* ───────── Search ───────── */

function onSearch() {
  const input = document.getElementById('searchInput')
  const clearBtn = document.getElementById('clearSearch')
  const q = input ? input.value.trim() : ''
  if (clearBtn) clearBtn.classList.toggle('visible', !!q)

  if (!q) {
    searchActive = false
    const searchMeta = document.getElementById('searchMeta')
    if (searchMeta) searchMeta.style.display = 'none'
    if (pokemonList.length) { renderDeck(pokemonList); updatePagination() }
    else { loadPage(currentOffset) }
    return
  }

  searchActive = true
  selectedId = null
  document.getElementById('detailPanel').innerHTML = `
    <div class="detail-placeholder">
      <div class="dp-icon">
        <svg viewBox="0 0 100 100" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="white" stroke="#333" stroke-width="4"/>
          <path d="M6 50 A44 44 0 0 1 94 50" fill="#e60012"/>
          <line x1="6" y1="50" x2="94" y2="50" stroke="#333" stroke-width="4"/>
          <circle cx="50" cy="50" r="12" fill="white" stroke="#333" stroke-width="3"/>
          <circle cx="50" cy="50" r="5" fill="#333"/>
        </svg>
      </div>
      <p>选择一只宝可梦查看详情</p>
    </div>`
  renderSearchResults(q)
}

/* ───────── Generation ───────── */

function selectGeneration(genId) {
  if (isLoading) return
  selectedGen = genId
  currentOffset = 0
  document.getElementById('searchInput').value = ''
  searchActive = false
  selectedId = null
  const detailPanel = document.getElementById('detailPanel')
  if (detailPanel) {
    detailPanel.innerHTML = `
      <div class="detail-placeholder">
        <div class="dp-icon">
          <svg viewBox="0 0 100 100" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="white" stroke="#333" stroke-width="4"/>
            <path d="M6 50 A44 44 0 0 1 94 50" fill="#e60012"/>
            <line x1="6" y1="50" x2="94" y2="50" stroke="#333" stroke-width="4"/>
            <circle cx="50" cy="50" r="12" fill="white" stroke="#333" stroke-width="3"/>
            <circle cx="50" cy="50" r="5" fill="#333"/>
          </svg>
        </div>
        <p>选择一只宝可梦查看详情</p>
      </div>`
  }

  document.querySelectorAll('.gen-btn').forEach(btn => {
    const isActive = (genId === null && btn.dataset.gen === 'all') ||
                     (genId !== null && parseInt(btn.dataset.gen) === genId)
    btn.classList.toggle('active', isActive)
    const dot = btn.querySelector('.gen-dot')
    if (dot) dot.classList.toggle('active', isActive)
  })

  loadPage(0)
}

/* ───────── Theme ───────── */

function setTheme(theme) {
  if (theme === currentTheme) return
  currentTheme = theme
  localStorage.setItem('pokedex_theme', theme)

  // always re-run render so sidebar toggle state updates
  render()

  // body background can't be scoped to .app-layout
  if (theme === 'switch') {
    document.body.style.background = '#ecedec'
    document.body.style.backgroundImage = 'none'
  } else if (theme === 'joycon') {
    document.body.style.background = '#f0f0f0'
    document.body.style.backgroundImage = 'none'
  } else {
    document.body.style.background = ''
    document.body.style.backgroundImage = ''
  }
}

/* ───────── Detail View ───────── */

async function showDetail(id) {
  // keep existing variety cycle when switching forms within same family
  if (!_varietyCycle.find(f => f.id === id)) {
    _varietyCycle = []
    _currentFlavorText = ''
  }
  selectedId = id
  let pokemon = pokemonList.find(p => p.id === id) || allPokemonBasic.find(p => p.id === id)
  if (!pokemon) {
    pokemon = { id, name: `pokemon-${id}`, url: `${API_BASE}/${id}/`, image: `${SPRITE_BASE}/${SPRITE_OVERRIDE[id] || id}.png`, nameCn: '' }
  }

  // update selected card highlight
  document.querySelectorAll('.preview-card.selected').forEach(c => c.classList.remove('selected'))
  document.querySelector(`.preview-card[data-id="${id}"]`)?.classList.add('selected')

  const panel = document.getElementById('detailPanel')
  panel.innerHTML = `
    <div class="detail-view">
      <div class="image-area" style="background:linear-gradient(135deg, #6366f115 0%, #eef0f4 50%);">
        <div style="display:flex;align-items:center;justify-content:center;padding:40px;width:100%;">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </div>`

  try {
    const res = await fetch(pokemon.url)
    const detail = await res.json()

    // fetch species for varieties & flavor text
    let varieties = []
    let flavorText = ''
    try {
      const speciesRes = await fetch(`${SPECIES_BASE}/${id}/`)
      const species = await speciesRes.json()
      const cnFlavor = species.flavor_text_entries?.find(e => e.language.name === 'zh-hans')
      if (cnFlavor) {
        flavorText = cnFlavor.flavor_text.replace(/[\n\f\r]/g, ' ').trim()
        _currentFlavorText = flavorText
      }
      if (species && species.varieties) {
        varieties = species.varieties
          .filter(v => !v.is_default)
          .map(v => {
            const segs = v.pokemon.url.replace(/\/$/, '').split('/')
            return { id: parseInt(segs[segs.length - 1]), name: v.pokemon.name, url: v.pokemon.url }
          })
      }
    } catch {}
    const displayFlavorText = flavorText || _currentFlavorText

    // prefer alternate form sprite when default is less recognizable
    let displaySpriteId = SPRITE_OVERRIDE[id] || id
    if (displaySpriteId === id && varieties.length > 0) {
      const better = varieties.find(v => /hero|mega-[xy]/.test(v.name))
      if (better) displaySpriteId = better.id
    }

    // shiny URL
    const shinyUrl = detail.sprites?.other?.['official-artwork']?.front_shiny
      || `${SPRITE_BASE}/shiny/${displaySpriteId}.png`

    // ── filter moves: prefer level-up, take 4 highest-level ──
    const allMovesWithMeta = detail.moves.map(m => {
      const up = m.version_group_details.find(v => v.move_learn_method.name === 'level-up')
      const machine = m.version_group_details.find(v => v.move_learn_method.name === 'machine')
      return {
        move: m.move,
        learnMethod: up ? 'level-up' : machine ? 'machine' : 'other',
        level: up ? up.level_learned_at : 0,
      }
    })
    const levelUpMoves = allMovesWithMeta.filter(m => m.learnMethod === 'level-up' && m.level > 0)
    const bestMoves = [...levelUpMoves].sort((a, b) => b.level - a.level).slice(0, 4)

    const moveFetchUrls = bestMoves.map(m => m.move.url)
    const allMoveUrls = levelUpMoves.map(m => m.move.url)

    const urls = [...detail.abilities.map(a => a.ability.url), ...moveFetchUrls]
    const nameResults = await Promise.allSettled(
      urls.map(url =>
        fetch(url).then(r => r.json()).then(d => {
          const cn = d.names?.find(n => n.language.name === 'zh-hans')
          const flavor = d.flavor_text_entries?.find(n => n.language.name === 'zh-hans')
          return {
            url,
            nameCn: cn ? cn.name : d.name,
            desc: flavor ? flavor.flavor_text.replace(/[\n\f\r]/g, ' ').trim() : '',
            type: d.type?.name || 'normal',
            damageClass: d.damage_class?.name || 'status',
          }
        })
      )
    )
    const nameMap = {}
    nameResults.forEach(r => { if (r.status === 'fulfilled') nameMap[r.value.url] = { name: r.value.nameCn, desc: r.value.desc, type: r.value.type, damageClass: r.value.damageClass } })

    // ── type chart ──
    const typeMultipliers = {}
    try {
      const typeResults = await Promise.allSettled(
        detail.types.map(t => fetch(t.type.url).then(r => r.json()))
      )
      typeResults.forEach(r => {
        if (r.status !== 'fulfilled') return
        const rel = r.value.damage_relations
        rel.double_damage_from?.forEach(t => { typeMultipliers[t.name] = (typeMultipliers[t.name] || 1) * 2 })
        rel.half_damage_from?.forEach(t => { typeMultipliers[t.name] = (typeMultipliers[t.name] || 1) * 0.5 })
        rel.no_damage_from?.forEach(t => { typeMultipliers[t.name] = 0 })
      })
      // fill remaining types with neutral
      Object.keys(TYPE_COLORS).forEach(t => { if (!(t in typeMultipliers)) typeMultipliers[t] = 1 })
    } catch {}
    const tce = Object.entries(typeMultipliers).filter(([_, v]) => v !== 1).sort((a, b) => b[1] - a[1])

    // fetch Chinese names for varieties
    const varietyCn = {}
    if (varieties.length > 0) {
      const vResults = await Promise.allSettled(
        varieties.map(v =>
          fetch(`${SPECIES_BASE}/${v.id}/`)
            .then(r => r.json())
            .then(s => {
              const cn = s.names.find(n => n.language.name === 'zh-hans')
              return { id: v.id, nameCn: cn ? cn.name : v.name }
            })
            .catch(() => ({ id: v.id, nameCn: v.name }))
        )
      )
      vResults.forEach(r => { if (r.status === 'fulfilled') varietyCn[r.value.id] = r.value.nameCn })
    }

    // build form cycle cache
    const pname = _varietyCycle.find(f => f.id === id)?.name || pokemon.nameCn || pokemon.name
    if (varieties.length > 0) {
      _varietyCycle = [{ id, name: pname }, ...varieties.map(v => ({ id: v.id, name: formatRegionalName(v.name, pname) || varietyCn[v.id] || NAME_CN[v.name] || v.name }))]
    }

    // determine primary type for glow
    const primaryType = detail.types[0].type.name
    const glowColor = TYPE_COLORS[primaryType] || '#6366f1'
    const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`

    // recommend natures based on base stats
    const recommendedNatures = recommendNatures(detail.stats).map(n => {
      const cn = NATURE_CN[n]
      const [up, down] = NATURE_STATS[n]
      let desc = cn
      if (up && down) desc = `${cn} (＋${STAT_CN[up]} －${STAT_CN[down]})`
      return `<span class="nature-chip" data-desc="${desc.replace(/"/g, '&quot;')}">${cn}</span>`
    }).join('')

    panel.innerHTML = `
      <div class="detail-view">
        <div class="image-area" style="background:linear-gradient(135deg, ${glowColor}15 0%, #eef0f4 50%);">
          <div class="image-wrap">
            <button class="shiny-btn" id="shinyToggle">✨</button>
            ${_varietyCycle.length > 1 ? `
            <button class="var-arrow var-arrow-left">◀</button>
            <button class="var-arrow var-arrow-right">▶</button>
            ` : ''}
            <img id="modalPkmImg" src="${SPRITE_BASE}/${displaySpriteId}.png" alt="${pname}"
                 data-normal="${SPRITE_BASE}/${displaySpriteId}.png" data-shiny="${shinyUrl}"
                 onerror="this.src=this.dataset.normal" />
          </div>
          ${displayFlavorText ? `<div class="pkm-description">${displayFlavorText}</div>` : ''}
          <div class="pkm-stats">
            <div class="pkm-section-label">种族值</div>
            ${detail.stats.map(s => {
              const sn = STAT_CN[s.stat.name] || s.stat.name
              const sc = STAT_COLORS[s.stat.name] || '#6366f1'
              const pct = Math.min(100, (s.base_stat / 255) * 100)
              return `<div class="stat-row">
                <span class="sr-name">${sn}</span>
                <div class="sr-bg"><div class="sr-fill" style="width:${pct}%;background:${sc};"></div></div>
                <span class="sr-val">${s.base_stat}</span>
              </div>`
            }).join('')}
            <div class="stat-total">总和: ${detail.stats.reduce((sum, s) => sum + s.base_stat, 0)}</div>
          </div>
        </div>

        <div class="info-panel" id="infoPanel">
          <div class="panel-number">No.${String(id).padStart(3, '0')}</div>
          <div class="panel-name-row">
            <h2 class="panel-name" style="color:${glowColor}">${pname}</h2>
            <button id="cryBtn" class="cry-btn" title="播放叫声">🔊</button>
            <span class="panel-ht">${(detail.height / 10).toFixed(1)} m</span>
            <span class="panel-sep">·</span>
            <span class="panel-wt">${(detail.weight / 10).toFixed(1)} kg</span>
          </div>
          <audio id="pkmCry" preload="auto" style="display:none">
            <source src="${cryUrl}" type="audio/ogg">
            <source src="${cryUrl.replace('.ogg','.mp3')}" type="audio/mpeg">
          </audio>

          <div class="panel-types">
            ${detail.types.map(t => `
              <span class="type-icon" style="background:${TYPE_COLORS[t.type.name] || '#64748b'}">${TYPE_NAMES_CN[t.type.name] || t.type.name}</span>
            `).join('')}
          </div>

          ${tce.length > 0 ? `
          <div class="section-title">属性相克</div>
          <div class="type-chart">
            ${[[4, 'quad'], [2, 'dbl'], [0.5, 'half'], [0.25, 'quarter'], [0, 'immune']].map(([val, cls]) => {
              const items = tce.filter(([_, m]) => val === 0 ? m === 0 : m === val)
              if (items.length === 0) return ''
              const label = val === 0 ? '免' : val === 0.5 ? '½×' : val === 0.25 ? '¼×' : val + '×'
              return `<div class="tc-row"><span class="tc-label tc-${cls}">${label}</span>${items.map(([type]) =>
                `<span class="tc-item" style="background:${TYPE_COLORS[type] || '#64748b'}">${TYPE_NAMES_CN[type] || type}</span>`
              ).join('')}</div>`
            }).join('')}
          </div>` : ''}

          <div class="section-title" style="display:flex;justify-content:space-between;">
            <span>特性</span>
            <span class="nature-label">推荐性格</span>
          </div>
          <div class="abilities-row">
            ${detail.abilities.map(a => {
              const info = nameMap[a.ability.url] || { name: a.ability.name.replace(/-/g, ' '), desc: '' }
              return `<span class="ability-chip"${info.desc ? ` data-desc="${info.desc.replace(/"/g, '&quot;')}"` : ''}>${info.name}${a.is_hidden ? ' <span style="font-size:9px;opacity:0.5;">(隐藏)</span>' : ''}</span>`
            }).join('')}
            <span class="nature-inline">${recommendedNatures}</span>
          </div>

          <div class="section-title">推荐配招</div>
          <div class="moves-grid" id="movesGrid">
            ${bestMoves.map(m => {
              const info = nameMap[m.move.url] || { name: m.move.name.replace(/-/g, ' '), desc: '', type: 'normal', damageClass: 'status' }
              const dcLabel = DAMAGE_CLASS_CN[info.damageClass] || '变化'
              const descAttr = info.desc ? ` data-desc="${info.desc.replace(/"/g, '&quot;')}"` : ''
              return `<div class="move-card"${descAttr}>
                <span class="move-type-dot" style="background:${TYPE_COLORS[info.type] || '#64748b'}"></span>
                <span class="move-name">${info.name}</span>
                <span class="move-cat ${info.damageClass}">${dcLabel}</span>
              </div>`
            }).join('')}
          </div>
          ${allMoveUrls.length > 4 ? `
          <button id="viewAllMovesBtn" class="view-all-btn">查看全部 ${allMoveUrls.length} 个招式 →</button>
          <div id="allMovesContainer" style="display:none;"></div>` : ''}
        </div>
      </div>`

    // ── tooltips ──
    setupDetailTooltips(panel)

    // ── shiny toggle ──
    const shinyBtn = document.getElementById('shinyToggle')
    let isShiny = false
    if (shinyBtn) {
      shinyBtn.addEventListener('click', () => {
        isShiny = !isShiny
        const img = document.getElementById('modalPkmImg')
        if (img) {
          img.src = isShiny ? img.dataset.shiny : img.dataset.normal
          shinyBtn.classList.toggle('active', isShiny)
        }
      })
    }

    // ── cry playback ──
    const audio = document.getElementById('pkmCry')
    if (audio) {
      audio.volume = 0.3
      audio.play().catch(() => {})
      document.getElementById('cryBtn')?.addEventListener('click', () => {
        audio.currentTime = 0
        audio.play().catch(() => {})
      })
    }

    // ── variety arrows ──
    if (_varietyCycle.length > 1) {
      panel.querySelectorAll('.var-arrow').forEach(btn => {
        btn.addEventListener('click', () => {
          const currentIdx = _varietyCycle.findIndex(f => f.id === id)
          if (currentIdx === -1) return
          const dir = btn.classList.contains('var-arrow-right') ? 1 : -1
          let nextIdx = currentIdx + dir
          if (nextIdx < 0) nextIdx = _varietyCycle.length - 1
          if (nextIdx >= _varietyCycle.length) nextIdx = 0
          showDetail(_varietyCycle[nextIdx].id)
        })
      })
    }

    // ── view all moves ──
    const viewAllBtn = document.getElementById('viewAllMovesBtn')
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', async () => {
        const container = document.getElementById('allMovesContainer')
        const grid = document.getElementById('movesGrid')
        if (!container || !grid) return

        viewAllBtn.textContent = '加载中...'
        viewAllBtn.disabled = true

        const allMoveData = {}
        const BATCH = 10
        for (let i = 0; i < allMoveUrls.length; i += BATCH) {
          const batch = allMoveUrls.slice(i, i + BATCH)
          const results = await Promise.allSettled(
            batch.map(url =>
              fetch(url).then(r => r.json()).then(d => {
                const cn = d.names?.find(n => n.language.name === 'zh-hans')
                const flavor = d.flavor_text_entries?.find(n => n.language.name === 'zh-hans')
                return {
                  url,
                  nameCn: cn ? cn.name : d.name,
                  desc: flavor ? flavor.flavor_text.replace(/[\n\f\r]/g, ' ').trim() : '',
                  type: d.type?.name || 'normal',
                  damageClass: d.damage_class?.name || 'status',
                }
              })
            )
          )
          results.forEach(r => { if (r.status === 'fulfilled') allMoveData[r.value.url] = r.value })
        }

        grid.style.display = 'none'
        viewAllBtn.style.display = 'none'

        container.style.display = 'block'
        container.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span class="section-title" style="margin:0;">全部招式 (${allMoveUrls.length})</span>
            <button id="collapseMovesBtn" style="background:none;border:none;color:#475569;cursor:pointer;font-size:11px;font-family:monospace;">收起 ↑</button>
          </div>
          <div class="moves-grid">
            ${levelUpMoves.map(m => {
              const data = allMoveData[m.move.url]
              if (!data) return ''
              const dcLabel = DAMAGE_CLASS_CN[data.damageClass] || '变化'
              const descAttr = data.desc ? ` data-desc="${data.desc.replace(/"/g, '&quot;')}"` : ''
              return `<div class="move-card"${descAttr}>
                <span class="move-type-dot" style="background:${TYPE_COLORS[data.type] || '#64748b'}"></span>
                <span class="move-lv" style="font-size:9px;font-family:monospace;color:#475569;min-width:28px;">Lv.${m.level}</span>
                <span class="move-name">${data.nameCn}</span>
                <span class="move-cat ${data.damageClass}">${dcLabel}</span>
              </div>`
            }).join('')}
          </div>`

        setupDetailTooltips(container)

        document.getElementById('collapseMovesBtn')?.addEventListener('click', () => {
          container.style.display = 'none'
          grid.style.display = 'grid'
          viewAllBtn.style.display = 'block'
          viewAllBtn.textContent = `查看全部 ${allMoveUrls.length} 个招式 →`
          viewAllBtn.disabled = false
        })
      })
    }

  } catch {
    panel.innerHTML = '<div class="detail-view"><div class="info-panel"><p style="color:#f87171;font-size:12px;font-family:monospace;padding:40px;text-align:center;">数据加载失败</p></div></div>'
  }
}

function setupDetailTooltips(container) {
  const tooltip = document.getElementById('floatTooltip')
  if (!tooltip) return
  container.querySelectorAll('[data-desc]:not([data-desc=""])').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect()
      tooltip.textContent = el.dataset.desc
      tooltip.style.left = rect.left + rect.width / 2 + 'px'
      tooltip.style.top = rect.top + 'px'
      tooltip.style.display = 'block'
      tooltip.style.whiteSpace = el.classList.contains('nature-chip') ? 'nowrap' : ''
    })
    el.addEventListener('mouseleave', () => { tooltip.style.display = 'none' })
  })
}

render()
