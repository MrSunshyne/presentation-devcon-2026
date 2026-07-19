<script setup lang="ts">
import { deckTools } from '../composables/deckTools'
</script>

<template>
  <div class="panel" :data-on="deckTools.supported">
    <template v-if="deckTools.supported">
      <p class="headline">✅ WebMCP is on — this deck registered {{ deckTools.names.length }} tools:</p>
      <div class="tools">
        <code v-for="name in deckTools.names" :key="name">{{ name }}</code>
      </div>
      <p class="hint">Open the <strong>Model Context Tool Inspector</strong> and ask it to drive the slides.</p>
      <div v-if="deckTools.log.length" class="log">
        <p>Agent activity:</p>
        <code v-for="(entry, i) in deckTools.log" :key="i">{{ entry }}</code>
      </div>
    </template>
    <template v-else>
      <p class="headline">WebMCP isn't available in this browser.</p>
      <p class="hint">
        Chrome 149+: enable <code>chrome://flags/#enable-webmcp-testing</code> and relaunch —
        or run the origin trial. The deck registers its tools automatically when it can.
      </p>
    </template>
  </div>
</template>

<style scoped>
.panel {
  margin-top: 1.2rem;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 1.1rem 1.3rem;
  background: #fffbe6;
}
.panel[data-on='true'] { background: #e6fff5; }
.headline { font-size: 1.15rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.7rem; }
.tools { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tools code, .log code {
  border: 2px solid #000;
  border-radius: 999px;
  background: #fff;
  padding: 0.2rem 0.75rem;
  font-size: 0.85rem;
}
.hint { font-size: 0.9rem; color: #555; margin: 0.8rem 0 0; }
.hint code { background: #f5f5f5; padding: 0.1em 0.4em; border-radius: 4px; }
.log { margin-top: 0.8rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.log p { font-size: 0.85rem; font-weight: 700; margin: 0; }
.log code { background: #ffd700; }
/* the panel keeps a light background in dark mode — force dark ink over the
   theme's light dark-mode paragraph colour */
html.dark .panel p.headline { color: #1a1a1a; }
html.dark .panel p.hint { color: #555; }
html.dark .panel .log p { color: #1a1a1a; }
</style>
