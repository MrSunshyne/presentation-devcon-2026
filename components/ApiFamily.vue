<script setup lang="ts">
const APIS = [
  { name: 'Summarizer', job: 'long text → short text', status: 'stable', since: '138' },
  { name: 'Translator', job: 'language → language', status: 'stable', since: '138' },
  { name: 'LanguageDetector', job: 'what language is this?', status: 'stable', since: '138' },
  { name: 'LanguageModel', job: 'prompt it directly', status: 'stable', since: '148' },
  { name: 'Writer / Rewriter', job: 'draft & rephrase', status: 'limbo' },
  { name: 'Proofreader', job: 'find mistakes', status: 'limbo' },
]
</script>

<template>
  <div class="family">
    <div v-for="api in APIS" :key="api.name" class="api-card" :data-status="api.status">
      <div class="icon">
        <carbon-document v-if="api.name === 'Summarizer'" />
        <carbon-translate v-else-if="api.name === 'Translator'" />
        <carbon-language v-else-if="api.name === 'LanguageDetector'" />
        <carbon-chat-bot v-else-if="api.name === 'LanguageModel'" />
        <carbon-pen v-else-if="api.name === 'Writer / Rewriter'" />
        <carbon-checkmark-outline v-else />
      </div>
      <div class="name">{{ api.name }}</div>
      <p class="job">{{ api.job }}</p>
      <span class="chip">{{ api.status === 'stable' ? `stable since ${api.since}` : 'in limbo' }}</span>
    </div>
  </div>
</template>

<style scoped>
.family {
  margin-top: 0.6rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
}
.api-card {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fff;
  padding: 0.55rem 0.8rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 4px 4px 0 #000;
}
.api-card[data-status='limbo'] {
  border-style: dashed;
  box-shadow: none;
  opacity: 0.75;
}
.icon { font-size: 1.25rem; color: #0080ff; }
.api-card[data-status='limbo'] .icon { color: #b8a500; }
.name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  background: none;
  padding: 0;
}
.job { margin: 0; font-size: 0.85rem; color: #555; flex: 1; }
.chip {
  align-self: flex-start;
  border: 2px solid #000;
  border-radius: 999px;
  padding: 0.1rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: #00d68f;
  color: #1a1a1a;
}
.api-card[data-status='limbo'] .chip { background: #ffd700; }

html.dark .family .api-card { background: #1e293b; }
html.dark .family .name { color: #f1f5f9; }
html.dark .family .job { color: #94a3b8; }
html.dark .family .icon { color: #60a5fa; }
html.dark .family .api-card[data-status='limbo'] .icon { color: #ffd700; }
</style>
