<script setup lang="ts">
import { ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const text = ref('Où est le prochain arrêt de bus, s\'il vous plaît ?')
const target = ref('en')
const detected = ref<{ lang: string, confidence: number } | null>(null)
const output = ref('')
const status = ref('')
const busy = ref(false)

const LANGS: Record<string, string> = { en: 'English', fr: 'French', de: 'German', es: 'Spanish', ja: 'Japanese' }

async function run() {
  if (busy.value) return
  busy.value = true
  detected.value = null
  output.value = ''
  let detector: any, translator: any
  try {
    status.value = 'detecting language…'
    detector = await createSession('LanguageDetector', {},
      (f) => { status.value = `downloading detector… ${Math.round(f * 100)}%` })
    const [top] = await detector.detect(text.value)
    detected.value = { lang: top.detectedLanguage, confidence: top.confidence }

    if (top.detectedLanguage === target.value) {
      status.value = `already in ${LANGS[target.value] ?? target.value} — pick another target`
      return
    }
    status.value = 'translating…'
    translator = await createSession(
      'Translator',
      { sourceLanguage: top.detectedLanguage, targetLanguage: target.value },
      (f) => { status.value = `downloading ${top.detectedLanguage}→${target.value} pack… ${Math.round(f * 100)}%` },
    )
    output.value = await translator.translate(text.value)
    status.value = ''
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    detector?.destroy?.()
    translator?.destroy?.()
    busy.value = false
  }
}
</script>

<template>
  <div class="demo">
    <textarea v-model="text" rows="2" spellcheck="false" />
    <div class="controls">
      <label>to</label>
      <select v-model="target">
        <option v-for="(name, code) in LANGS" :key="code" :value="code">{{ name }}</option>
      </select>
      <button class="go" :disabled="busy" @click="run">Detect &amp; translate</button>
      <span v-if="status" class="status">{{ status }}</span>
    </div>
    <div v-if="detected" class="detected">
      detected: <strong>{{ LANGS[detected.lang] ?? detected.lang }}</strong>
      <span class="conf">{{ (detected.confidence * 100).toFixed(1) }}% sure</span>
    </div>
    <div v-if="output" class="output">{{ output }}</div>
  </div>
</template>

<style scoped>
.demo { margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.7rem; }
textarea {
  width: 100%;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 0.6rem 0.8rem;
  font: inherit;
  font-size: 1rem;
  background: #fff;
  color: #333;
  resize: none;
}
.controls { display: flex; align-items: center; gap: 0.7rem; }
.controls label { font-size: 0.9rem; color: #666; }
select {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font: inherit;
  font-size: 0.9rem;
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
.detected { font-size: 0.95rem; color: #1a1a1a; }
.detected .conf {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  background: #00d68f;
  border: 2px solid #000;
  border-radius: 999px;
  padding: 0.1rem 0.6rem;
  font-weight: 700;
}
.output {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fffbe6;
  padding: 0.7rem 0.9rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
}
html.dark .demo .status { color: #94a3b8; }
html.dark .demo .controls label { color: #94a3b8; }
html.dark .demo .detected { color: #f1f5f9; }
html.dark .demo .detected .conf { color: #1a1a1a; }
html.dark .demo .output { color: #1a1a1a; }
</style>
