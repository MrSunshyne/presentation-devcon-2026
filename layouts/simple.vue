<script setup lang="ts">
import CardLayers from '../components/CardLayers.vue'

// Define props that will be populated from frontmatter
const props = defineProps<{
  tagline?: string
  heading?: string
  text?: string
}>()
</script>

<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- Background with patterns -->
    <div 
      class="absolute inset-0 bg-theme-blue z-0"
      style="view-transition-name: background-layer"
    >
      <!-- Geometric patterns overlay -->
      <div class="absolute inset-0 opacity-50 bg-repeat" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 100px)"></div>
    </div>
    
    <!-- Layered cards component -->
    <CardLayers size="default" class="h-full">
      <div class="layout-default flex flex-col h-full">
        <!-- Tagline (small, uppercase) -->
        <p v-if="tagline" class="text-sm uppercase tracking-wider font-bold !text-gray-400 !m-0">
          {{ tagline }}
        </p>
        
        <!-- Heading (large, bold) -->
        <h1 v-if="heading" class="!text-3xl !text-theme-orange mb-6 leading-tight" style="view-transition-name: heading">
          {{ heading }}
        </h1>
        
        <!-- Text content -->
        <p v-if="text" class="!text-2xl text-gray-700 font-bold leading-relaxed flex-1 text-center pt-16">
          {{ text }}
        </p>
        
        <!-- Slot for additional markdown content -->
        <div v-if="!tagline && !heading && !text">
          <slot />
        </div>
        
        <!-- Or slot after props if they exist -->
        <div v-else >
          <slot />
        </div>
      </div>
    </CardLayers>
  </div>
</template>
