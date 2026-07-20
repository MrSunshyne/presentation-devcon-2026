<script setup lang="ts">
import { ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const request = ref('Mo pou zwenn Sarah vandredi 3er kot Flying Dodo')
const output = ref('')
const status = ref('')
const busy = ref(false)

// both the persona and the contract are editable on the slide
const systemPrompt = ref(
  'You extract structured details from short messages. Messages may be in '
  + 'English, French or Mauritian Creole ("vandredi" = Friday, "3er" = 3 o\'clock, '
  + '"kot" = at). Answer in English; times like "Friday, 3 pm"; places as just the place name.',
)

const schemaText = ref(`{
  "type": "object",
  "properties": {
    "who":   { "type": "string" },
    "when":  { "type": "string" },
    "where": { "type": "string" }
  },
  "required": ["who", "when", "where"]
}`)

async function run() {
  if (busy.value) return
  let schema: unknown
  try {
    schema = JSON.parse(schemaText.value)
  } catch {
    status.value = 'the schema box is not valid JSON'
    return
  }
  busy.value = true
  output.value = ''
  status.value = 'waking the model…'
  let session: any
  try {
    session = await createSession(
      'LanguageModel',
      { initialPrompts: [{ role: 'system', content: systemPrompt.value }] },
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` },
    )
    status.value = 'extracting, on-device…'
    const reply = await session.prompt(request.value, { responseConstraint: schema })
    output.value = JSON.stringify(JSON.parse(reply), null, 2)
    status.value = ''
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    session?.destroy?.()
    busy.value = false
  }
}
</script>

<template>
  <div class="demo">
    <div class="ask-row">
      <input v-model="request" spellcheck="false" @keyup.enter="run">
      <button class="go" :disabled="busy" @click="run">Extract</button>
    </div>
    <span v-if="status" class="status">{{ status }}</span>
    <details class="box sys">
      <summary class="box-title">initialPrompts - the system prompt, edit me</summary>
      <textarea v-model="systemPrompt" rows="3" spellcheck="false" class="schema-edit" />
    </details>
    <div class="boxes">
      <div class="box">
        <p class="box-title">responseConstraint - edit me</p>
        <textarea v-model="schemaText" rows="9" spellcheck="false" class="schema-edit" />
      </div>
      <div class="box reply" :data-filled="!!output">
        <p class="box-title">the reply - parses every time</p>
        <pre v-if="output">{{ output }}</pre>
        <p v-else class="empty">nothing yet</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.55rem; }
.ask-row { display: flex; gap: 0.6rem; }
input {
  flex: 1;
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font: inherit;
  font-size: 0.95rem;
  background: #fff;
  color: #1a1a1a;
}
.go {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 1.2rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  background: #ffd700;
  color: #1a1a1a;
  cursor: pointer;
}
.go:hover:not(:disabled) { background: #00d68f; }
.go:disabled { opacity: 0.5; cursor: wait; }
.status { font-size: 0.8rem; color: #666; font-family: monospace; }
.boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.box {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fff;
  padding: 0.45rem 0.8rem;
}
.box.reply { background: #fffbe6; }
.box.reply[data-filled='true'] { background: #e6fff5; }
.box-title { margin: 0 0 0.4rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
.sys summary.box-title { margin: 0; cursor: pointer; }
.sys[open] summary.box-title { margin-bottom: 0.4rem; }
.box pre { margin: 0; font-size: 0.85rem; line-height: 1.5; color: #1a1a1a; background: none; padding: 0; }
.schema-edit {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: monospace;
  font-size: 0.78rem;
  line-height: 1.45;
  color: #1a1a1a;
  resize: none;
}
.empty { margin: 0; color: #999; font-style: italic; font-size: 0.85rem; }
html.dark .demo .status { color: #94a3b8; }
html.dark .demo .box p.box-title { color: #888; }
html.dark .demo .box summary.box-title { color: #888; }
html.dark .demo .box p.empty { color: #999; }
</style>
