<template>
  <button 
    class="slidev-icon-btn" 
    :class="{ 'text-green-400': reactionsEnabled, 'opacity-50': !reactionsEnabled }"
    :title="reactionsEnabled ? 'Disable audience reactions' : 'Enable audience reactions'" 
    @click="toggleReactions"
  >
    <div v-if="reactionsEnabled" class="i-carbon-face-satisfied" />
    <div v-else class="i-carbon-face-neutral" />
  </button>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

// Use localStorage to persist the toggle state
const reactionsEnabled = useStorage('slidev-reactions-enabled', true)

function toggleReactions() {
  reactionsEnabled.value = !reactionsEnabled.value
}
</script>

