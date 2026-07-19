<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { createSession, hasGlobal, stateOf, type AiState } from '../composables/builtInAi'

interface Check {
  key: string
  label: string
  args?: Record<string, unknown>
  createArgs?: Record<string, unknown>
}

const CHECKS: Check[] = [
  { key: 'Summarizer', label: 'Summarizer' },
  { key: 'Translator', label: 'Translator en→fr', args: { sourceLanguage: 'en', targetLanguage: 'fr' }, createArgs: { sourceLanguage: 'en', targetLanguage: 'fr' } },
  { key: 'LanguageDetector', label: 'Language Detector' },
  { key: 'LanguageModel', label: 'Prompt API' },
  { key: 'Writer', label: 'Writer' },
  { key: 'Rewriter', label: 'Rewriter' },
  { key: 'Proofreader', label: 'Proofreader', createArgs: { expectedInputLanguages: ['en'] } },
]

const states = reactive<Record<string, AiState>>({})
const progress = reactive<Record<string, number>>({})
const webmcp = ref(false)
const stalePolls = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

async function refresh() {
  for (const c of CHECKS) states[c.key] = await stateOf(c.key, c.args)
  webmcp.value = typeof document !== 'undefined' && 'modelContext' in document
  clearTimeout(timer)
  if (Object.values(states).includes('downloading')) {
    // Chrome's component updater can idle for a long time in this state —
    // count the polls so the board can explain itself instead of looking stuck.
    stalePolls.value++
    timer = setTimeout(refresh, 4000)
  } else {
    stalePolls.value = 0
  }
}

// A chip that says "downloadable" can fetch its model on click —
// create() needs the user gesture anyway.
async function download(c: Check) {
  if (states[c.key] !== 'downloadable') return
  states[c.key] = 'downloading'
  try {
    const session = await createSession(c.key, c.createArgs, (f) => { progress[c.key] = f })
    session?.destroy?.()
  } catch { /* the refresh below reports the truth */ }
  delete progress[c.key]
  refresh()
}

onMounted(refresh)
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="board">
    <div class="chips">
      <button
        v-for="c in CHECKS" :key="c.key"
        class="chip" :data-state="states[c.key]"
        :title="states[c.key] === 'downloadable' ? 'Click to download the model' : undefined"
        @click="download(c)"
      >
        <span class="dot" />
        <span class="label">{{ c.label }}</span>
        <span class="state">
          {{ states[c.key] === 'downloading' && progress[c.key] != null
            ? `downloading ${Math.round(progress[c.key] * 100)}%`
            : states[c.key] ?? '…' }}
        </span>
      </button>
      <div class="chip" :data-state="webmcp ? 'available' : 'missing'">
        <span class="dot" />
        <span class="label">WebMCP</span>
        <span class="state">{{ webmcp ? 'available' : 'missing' }}</span>
      </div>
    </div>
    <p class="hint">Feature detection, live — a <em>downloadable</em> chip starts its model download when clicked.</p>
    <p v-if="stalePolls >= 3" class="hint stuck">
      <em>downloading</em> for a while? Chrome's updater fetches lazily and can idle at 0% —
      force it at <code>chrome://components</code> → “Optimization Guide On Device Model” → Check for update.
    </p>
  </div>
</template>

<style scoped>
.board { margin-top: 1rem; }
.chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.chip {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.9rem;
  border: 3px solid #000;
  border-radius: 999px;
  background: #fff;
  font-size: 0.95rem;
  text-align: left;
  cursor: default;
}
.chip[data-state='downloadable'] { cursor: pointer; }
.chip[data-state='downloadable']:hover { background: #fffbe6; }
.chip .label { font-weight: 700; color: #1a1a1a; }
.chip .state { margin-left: auto; font-size: 0.8rem; color: #666; font-family: monospace; }
.dot { width: 0.8rem; height: 0.8rem; border-radius: 50%; border: 2px solid #000; background: #d1d5db; flex: none; }
.chip[data-state='available'] .dot { background: #00d68f; }
.chip[data-state='downloadable'] .dot { background: #ffd700; }
.chip[data-state='downloading'] .dot { background: #ff6b4a; animation: pulse 1s infinite; }
.chip[data-state='unavailable'] .dot,
.chip[data-state='missing'] .dot { background: #e5e7eb; }
.chip[data-state='missing'] .state { color: #b91c1c; }
.hint { margin-top: 0.9rem; font-size: 0.85rem; color: #777; }
.hint.stuck { margin-top: 0.4rem; color: #c74e33; font-weight: 600; }
.hint.stuck code { background: none; padding: 0; font-weight: 700; }
html.dark .board .hint { color: #94a3b8; }
html.dark .board .hint.stuck { color: #ff6b4a; }
@keyframes pulse { 50% { opacity: 0.35; } }
</style>
