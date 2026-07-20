<script setup lang="ts">
import { ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const request = ref('Mo pou zwenn Sarah vandredi 3er kot Flying Dodo')
const output = ref('')
const status = ref('')
const busy = ref(false)

// the constraint is editable on the slide - add a field live and rerun
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
    session = await createSession('LanguageModel', {},
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` })
    status.value = 'extracting, on-device…'
    const reply = await session.prompt(
      `Extract the details from this message into the required JSON. The message `
      + `may be English, French or Mauritian Creole ("vandredi" = Friday, `
      + `"3er" = 3 o'clock, "kot" = at). Answer in English; times like "Friday, 3 pm"; `
      + `places as just the place name. Message: "${request.value}"`,
      { responseConstraint: schema },
    )
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
    <input v-model="request" spellcheck="false" @keyup.enter="run">
    <div class="controls">
      <button class="go" :disabled="busy" @click="run">Extract</button>
      <span v-if="status" class="status">{{ status }}</span>
    </div>
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
.demo { margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.7rem; }
input {
  width: 100%;
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font: inherit;
  font-size: 0.95rem;
  background: #fff;
  color: #1a1a1a;
}
.controls { display: flex; align-items: center; gap: 0.7rem; }
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
.boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
.box {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fff;
  padding: 0.6rem 0.9rem;
}
.box.reply { background: #fffbe6; }
.box.reply[data-filled='true'] { background: #e6fff5; }
.box-title { margin: 0 0 0.4rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
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
</style>
