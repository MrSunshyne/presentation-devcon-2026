<script setup lang="ts">
import { ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const SAMPLE = `The first graphical web browser, Mosaic, was released in 1993 and turned the internet from a text-only research tool into something anyone could point and click through. Netscape Navigator followed in 1994, and within a year it had added JavaScript, a scripting language written in ten days that let pages respond to their users. Internet Explorer, Firefox, Safari and Chrome spent the next two decades competing over speed, standards and security, while the pages they rendered grew from static documents into full applications. Today the browser is the most widely deployed piece of software on Earth, and it is learning a new trick: running language models of its own.`

const text = ref(SAMPLE)
const type = ref<'headline' | 'tldr' | 'key-points' | 'teaser'>('headline')
const output = ref('')
const status = ref('')
const busy = ref(false)
const copied = ref(false)

// A self-contained snippet for pasting into any Chrome 138+ DevTools console —
// grabs text from the host page via a selector, summarizes with the type
// currently picked on the slide, prints the result in the console.
function snippet() {
  return `// point this at the content you want summarized
const selector = 'main';

// slice keeps it inside the model's input quota
const text = (document.querySelector(selector)?.innerText ?? '').slice(0, 6000);

if (!text.trim()) {
  console.log('Nothing found for ' + selector + ' — try another selector');
} else if (await Summarizer.availability() === 'unavailable') {
  console.log('Summarizer is unavailable on this machine');
} else {
  const summarizer = await Summarizer.create({ type: '${type.value}', format: 'plain-text', length: 'short', outputLanguage: 'en' });
  console.log(await summarizer.summarize(text));
  summarizer.destroy();
}`
}

async function copySnippet() {
  await navigator.clipboard.writeText(snippet())
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
}

async function run() {
  if (busy.value) return
  busy.value = true
  output.value = ''
  status.value = 'creating session…'
  let summarizer: any
  try {
    summarizer = await createSession(
      'Summarizer',
      { type: type.value, format: 'plain-text', length: 'short', outputLanguage: 'en' },
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` },
    )
    status.value = 'summarizing on-device…'
    const stream = summarizer.summarizeStreaming(text.value)
    for await (const chunk of stream) output.value += chunk
    status.value = ''
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    summarizer?.destroy?.()
    busy.value = false
  }
}
</script>

<template>
  <div class="demo">
    <textarea v-model="text" rows="5" spellcheck="false" />
    <div class="controls">
      <select v-model="type">
        <option value="headline">headline</option>
        <option value="tldr">tl;dr</option>
        <option value="key-points">key points</option>
        <option value="teaser">teaser</option>
      </select>
      <button class="go" :disabled="busy" @click="run">Summarize</button>
      <button class="copy" @click="copySnippet">{{ copied ? 'copied ✓' : 'copy the code' }}</button>
      <span v-if="status" class="status">{{ status }}</span>
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
  font-size: 0.85rem;
  line-height: 1.45;
  background: #fff;
  color: #333;
  resize: none;
}
.controls { display: flex; align-items: center; gap: 0.7rem; }
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
.copy {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 1.2rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
}
.copy:hover { background: #fffbe6; }
.status { font-size: 0.8rem; color: #666; font-family: monospace; }
.output {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fffbe6;
  padding: 0.7rem 0.9rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: pre-wrap;
  max-height: 9rem;
  overflow: auto;
}
html.dark .demo .status { color: #94a3b8; }
html.dark .demo .output { color: #1a1a1a; }
</style>
