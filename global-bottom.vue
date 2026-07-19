<template>
  <div>
    <AudienceReactions 
        v-if="reactionsEnabled"
        :host="REACTIONS_HOST"
        :show-controls="false"
        :show-status="false"
        :show-animation-selector="false"
        default-animation="random"
        style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { useNav } from '@slidev/client'
import AudienceReactions from './components/audience/AudienceReactions.vue'
import { registerDeckTools } from './composables/deckTools'

const REACTIONS_HOST = 'slidev-audience.s4ndeep1203.workers.dev'

// Use the same storage key as custom-nav-controls.vue
const reactionsEnabled = useStorage('slidev-reactions-enabled', true)

// Expose the deck itself as WebMCP tools (next_slide, go_to_slide, …)
const nav = useNav()
onMounted(() => registerDeckTools(nav))
</script>
