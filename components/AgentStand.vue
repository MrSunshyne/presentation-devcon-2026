<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const MENU = [
  { id: 'dholl-puri', name: 'Dholl Puri (pair)', price: 30 },
  { id: 'roti-chaud', name: 'Roti Chaud', price: 25 },
  { id: 'gato-piment', name: 'Gato Piment (5)', price: 20 },
  { id: 'alouda', name: 'Alouda (big)', price: 50 },
]

const order = reactive(new Map<string, number>())
const log = ref<string[]>([])
const request = ref('2 dholl puri ek enn alouda, silvouple!')
const status = ref('')
const confirmation = ref('')
const busy = ref(false)
const webmcpActive = ref(false)

const total = computed(() =>
  [...order.entries()].reduce((sum, [id, qty]) => sum + (MENU.find(m => m.id === id)!.price * qty), 0))

function note(entry: string) {
  log.value.unshift(entry)
  if (log.value.length > 5) log.value.pop()
}

// The same functions serve three callers: the buttons, an external WebMCP
// agent, and the on-device agent below.
function addToOrder(id: string, quantity = 1) {
  if (!MENU.some(m => m.id === id)) return `unknown item "${id}"`
  order.set(id, (order.get(id) ?? 0) + quantity)
  confirmation.value = ''
  return `added ${quantity} × ${id}`
}

function checkout() {
  if (order.size === 0) return 'the order is empty'
  const number = 100 + Math.floor(Math.random() * 900)
  confirmation.value = `Order #${number} — Rs ${total.value}. Vini pran li dan 10 minit! 🛵`
  order.clear()
  return confirmation.value
}

// ── the local agent: on-device model → tool calls ──────────────────────────
const SCHEMA = {
  type: 'object',
  properties: {
    actions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string', enum: MENU.map(m => m.id) },
          quantity: { type: 'integer', minimum: 1, maximum: 10 },
        },
        required: ['item', 'quantity'],
      },
    },
    checkout: { type: 'boolean' },
  },
  required: ['actions', 'checkout'],
}

async function runAgent() {
  if (busy.value) return
  busy.value = true
  status.value = 'waking the on-device model…'
  let session: any
  try {
    session = await createSession('LanguageModel', {},
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` })
    status.value = 'thinking, locally…'
    const reply = await session.prompt(
      `You take orders at a Mauritian street-food stand. The menu (item ids): `
      + MENU.map(m => `${m.id} (Rs ${m.price})`).join(', ')
      + `. The customer may speak English, French or Mauritian Creole `
      + `("enn" = 1, "de" = 2, "trwa" = 3). Map their request to order actions, `
      + `and set checkout to true only if they sound done ordering. Customer said: "${request.value}"`,
      { responseConstraint: SCHEMA },
    )
    const parsed = JSON.parse(reply)
    for (const action of parsed.actions ?? []) {
      addToOrder(action.item, action.quantity)
      note(`add_to_order { item: '${action.item}', quantity: ${action.quantity} }`)
    }
    if (parsed.checkout) {
      checkout()
      note('checkout {}')
    }
    status.value = ''
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    session?.destroy?.()
    busy.value = false
  }
}

// ── WebMCP: the same tools, offered to external agents ─────────────────────
const abort = new AbortController()
onMounted(async () => {
  const mc = (document as any).modelContext
  if (!mc?.registerTool) return
  const text = (t: string) => ({ content: [{ type: 'text', text: t }] })
  const tools = [
    {
      name: 'get_menu',
      description: 'List what the dholl puri stand sells, with prices in rupees.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      async execute() {
        return text(MENU.map(m => `${m.id}: ${m.name} — Rs ${m.price}`).join('; '))
      },
    },
    {
      name: 'add_to_order',
      description: 'Add a menu item to the current order.',
      inputSchema: {
        type: 'object',
        properties: {
          item: { type: 'string', enum: MENU.map(m => m.id) },
          quantity: { type: 'integer', minimum: 1 },
        },
        required: ['item'],
      },
      async execute({ item, quantity = 1 }: { item: string, quantity?: number }) {
        note(`add_to_order { item: '${item}', quantity: ${quantity} } ← external agent`)
        return text(addToOrder(item, quantity))
      },
    },
    {
      name: 'checkout',
      description: 'Finalize the current order and get the pickup confirmation.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        note('checkout {} ← external agent')
        return text(checkout())
      },
    },
  ]
  try {
    for (const tool of tools) await mc.registerTool(tool, { signal: abort.signal })
    webmcpActive.value = true
  } catch (err) {
    console.warn('WebMCP registration failed', err)
  }
})
onUnmounted(() => abort.abort())
</script>

<template>
  <div class="stand">
    <div class="left">
      <ul class="menu">
        <li v-for="m in MENU" :key="m.id">
          <span class="name">{{ m.name }}</span>
          <span class="price">Rs {{ m.price }}</span>
          <button class="add" @click="addToOrder(m.id); note(`add_to_order { item: '${m.id}' } ← human`)">+</button>
        </li>
      </ul>
      <div class="order">
        <template v-if="order.size">
          <div v-for="[id, qty] in order" :key="id" class="line">
            {{ qty }} × {{ MENU.find(m => m.id === id)!.name }}
          </div>
          <div class="line total">Rs {{ total }} <button class="add" @click="note('checkout {} ← human'); checkout()">checkout</button></div>
        </template>
        <div v-else-if="!confirmation" class="line empty">nothing yet — hungry?</div>
        <div v-if="confirmation" class="line done">{{ confirmation }}</div>
      </div>
    </div>
    <div class="right">
      <div class="agent-row">
        <input v-model="request" spellcheck="false" @keyup.enter="runAgent">
        <button class="go" :disabled="busy" @click="runAgent">Ask the local agent</button>
      </div>
      <p v-if="status" class="status">{{ status }}</p>
      <div class="log">
        <p class="log-title">tool calls</p>
        <code v-for="(entry, i) in log" :key="i">{{ entry }}</code>
        <p v-if="!log.length" class="log-empty">none yet</p>
      </div>
      <p class="badge" :data-on="webmcpActive">
        {{ webmcpActive ? 'WebMCP: 3 tools registered for external agents' : 'WebMCP off — the local agent works anyway' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.stand {
  margin-top: 0.4rem;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 1rem;
  font-size: 0.9rem;
}
.menu { list-style: none; padding: 0; margin: 0; }
.menu li { display: flex; align-items: center; gap: 0.5rem; padding: 0.05rem 0; border-bottom: 2px dotted #ccc; }
.menu .name { font-weight: 600; color: #1a1a1a; }
.menu .price { margin-left: auto; color: #666; font-family: monospace; }
.add {
  border: 2px solid #000;
  border-radius: 999px;
  background: #ffd700;
  color: #1a1a1a;
  font-weight: 800;
  padding: 0 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.add:hover { background: #00d68f; }
.order { margin-top: 0.5rem; border: 3px solid #000; border-radius: 12px; padding: 0.4rem 0.9rem; background: #fff; min-height: 3rem; }
.order .line { padding: 0.1rem 0; color: #1a1a1a; }
.order .empty { color: #999; font-style: italic; }
.order .total { font-weight: 800; display: flex; align-items: center; gap: 0.7rem; border-top: 2px solid #000; margin-top: 0.3rem; padding-top: 0.4rem; }
.order .done { font-weight: 700; color: #067a4b; }
.agent-row { display: flex; gap: 0.6rem; }
.agent-row input {
  flex: 1;
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font: inherit;
  font-size: 0.9rem;
  background: #fff;
  color: #1a1a1a;
}
.go {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 1rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  background: #ffd700;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
}
.go:hover:not(:disabled) { background: #00d68f; }
.go:disabled { opacity: 0.5; cursor: wait; }
.status { font-size: 0.8rem; color: #666; font-family: monospace; margin: 0.5rem 0 0; }
.log { margin-top: 0.7rem; border: 3px solid #000; border-radius: 12px; background: #fffbe6; padding: 0.5rem 0.9rem; display: flex; flex-direction: column; gap: 0.3rem; min-height: 4.5rem; }
.log-title { margin: 0; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
.log code { font-size: 0.78rem; background: #fff; border: 2px solid #000; border-radius: 8px; padding: 0.15rem 0.5rem; }
.log-empty { margin: 0; color: #999; font-style: italic; font-size: 0.85rem; }
.badge { margin: 0.6rem 0 0; font-size: 0.78rem; color: #777; }
.badge[data-on='true'] { color: #067a4b; font-weight: 700; }
html.dark .stand .menu .name { color: #f1f5f9; }
html.dark .stand .menu .price { color: #94a3b8; }
html.dark .stand p.status { color: #94a3b8; }
html.dark .stand .log p { color: #888; }
html.dark .stand p.badge { color: #94a3b8; }
html.dark .stand p.badge[data-on='true'] { color: #00d68f; }
</style>
