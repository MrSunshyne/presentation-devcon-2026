<script setup lang="ts">
import { ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const task = ref('Invite my neighbours over on Saturday to taste my new dholl puri recipe')
const output = ref('')
const status = ref('')
const busy = ref(false)

async function write() {
  if (busy.value) return
  busy.value = true
  output.value = ''
  status.value = 'creating a Writer session…'
  let writer: any
  try {
    writer = await createSession(
      'Writer',
      { tone: 'neutral', format: 'plain-text', length: 'short', outputLanguage: 'en' },
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` },
    )
    status.value = 'writing on-device…'
    const stream = writer.writeStreaming(task.value)
    for await (const chunk of stream) output.value += chunk
    status.value = ''
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    writer?.destroy?.()
    busy.value = false
  }
}

async function rewrite(tone: 'more-formal' | 'more-casual') {
  if (busy.value || !output.value) return
  busy.value = true
  status.value = 'creating a Rewriter session…'
  const draft = output.value
  let rewriter: any
  try {
    rewriter = await createSession(
      'Rewriter',
      { tone, outputLanguage: 'en' },
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` },
    )
    status.value = `rewriting ${tone.replace('more-', '')}…`
    output.value = ''
    const stream = rewriter.rewriteStreaming(draft)
    for await (const chunk of stream) output.value += chunk
    status.value = ''
  } catch (err: any) {
    output.value = draft
    status.value = err?.message ?? String(err)
  } finally {
    rewriter?.destroy?.()
    busy.value = false
  }
}
</script>

<template>
  <div class="demo">
    <input v-model="task" spellcheck="false">
    <div class="controls">
      <button class="go" :disabled="busy" @click="write">Write</button>
      <button class="alt" :disabled="busy || !output" @click="rewrite('more-formal')">more formal</button>
      <button class="alt" :disabled="busy || !output" @click="rewrite('more-casual')">more casual</button>
      <span v-if="status" class="status">{{ status }}</span>
    </div>
    <div v-if="output" class="output">{{ output }}</div>
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
.alt {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 1.1rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
}
.alt:hover:not(:disabled) { background: #fffbe6; }
.alt:disabled { opacity: 0.4; cursor: default; }
.status { font-size: 0.8rem; color: #666; font-family: monospace; }
.output {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fffbe6;
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  color: #1a1a1a;
  white-space: pre-wrap;
  max-height: 11rem;
  overflow: auto;
}
html.dark .demo .status { color: #94a3b8; }
html.dark .demo .output { color: #1a1a1a; }
</style>
