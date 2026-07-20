<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const show = computed(() => $clicks.value >= 1)

const COLORS = ['#ffd700', '#ff6b4a', '#00d68f', '#00d4ff', '#ff4db8']

// hand-scattered so the whole screen gets some - same fun chaos every run
const SPOTS: Array<[number, number]> = [
  [4, 8], [22, 3], [45, 10], [68, 5], [88, 12],
  [10, 28], [35, 24], [60, 30], [83, 26],
  [5, 48], [28, 45], [52, 50], [76, 44], [91, 55],
  [15, 68], [40, 74], [65, 68], [85, 80],
]

const WORDS = SPOTS.map(([left, top], i) => ({
  left: `${left}%`,
  top: `${top}%`,
  rotate: `${((i * 47) % 56) - 28}deg`,
  size: `${1 + ((i * 29) % 130) / 100}rem`,
  color: COLORS[i % COLORS.length],
  delay: `${i * 70}ms`,
}))
</script>

<template>
  <div v-if="show" class="demo-rain" aria-hidden="true">
    <span
      v-for="(w, i) in WORDS" :key="i"
      :style="{ left: w.left, top: w.top, color: w.color, fontSize: w.size, animationDelay: w.delay, '--rot': w.rotate }"
    >demo</span>
  </div>
</template>

<style scoped>
.demo-rain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}
.demo-rain span {
  position: absolute;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-shadow: 2px 2px 0 #000;
  scale: 0;
  rotate: var(--rot);
  animation: demo-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes demo-pop {
  from { scale: 0; opacity: 0; rotate: calc(var(--rot) - 40deg); }
  to { scale: 1; opacity: 1; rotate: var(--rot); }
}
</style>
