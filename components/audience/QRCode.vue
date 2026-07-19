<template>
  <div class="qr-code-container">
    <div class="qr-code-box">
      <div class="qr-placeholder">
        <div class="qr-text">
          <p>{{ title }}</p>
        </div>
        <img 
          v-if="qrUrl" 
          :src="qrUrl" 
          :alt="`QR Code for ${url}`"
          class="qr-image"
        />
      </div>
      <p class="qr-instruction">{{ instruction }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  url: string
  title?: string
  instruction?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Join the Audience!',
  instruction: 'Scan to participate'
})

// Generate QR code URL using a free QR code API
const qrUrl = computed(() => {
  if (!props.url) return ''
  // Using QR Server API (free, no API key needed)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(props.url)}`
})
</script>

<style scoped>
.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 15px;
}

.qr-text {
  text-align: center;
}

.qr-text h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--theme-text-color);
}

.qr-text p {
  font-size: 16px;
  color: #666;
  font-family: monospace;
  word-break: break-all;
}

.qr-image {
  width: 300px;
  height: 300px;
  display: block;
}

.qr-instruction {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0;
}
</style>

