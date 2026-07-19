<script setup lang="ts">
import { computed } from 'vue'
import CardLayers from '../components/CardLayers.vue'

const props = defineProps<{
  image?: string
  imageClass?: string
}>()

// Default image class for styling
const imgClass = computed(() => props.imageClass || 'object-cover w-full h-full')
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
    
    <!-- Main container with grid layout -->
    <div class="absolute inset-0 grid grid-cols-2 gap-0 z-1">
      <!-- Left side: Card layers with content (clipped on left edge) -->
      <div class="relative flex items-center">
        <div class="relative" style="width: 550px; height: min(80%, 800px); margin-left: -50px;">
          <!-- Yellow card (bottom) -->
          <div 
            class="absolute w-full h-full top-40px left-40px bg-theme-yellow rounded-12px border-4 border-black shadow-2xl z-1"
            style="view-transition-name: card-layer-yellow"
          ></div>
          
          <!-- Orange card (middle) -->
          <div 
            class="absolute w-full h-full top-20px left-20px bg-theme-orange rounded-12px border-4 border-black shadow-2xl z-2"
            style="view-transition-name: card-layer-orange"
          ></div>
          
          <!-- White card (top) -->
          <div 
            class="absolute w-full h-full top-0 left-0 bg-white rounded-12px border-4 border-black shadow-2xl z-3 flex flex-col overflow-hidden"
            style="view-transition-name: card-layer-white"
          >
            <!-- Green asterisk accent -->
            <div 
              class="absolute top-30px right-30px text-64px font-bold text-theme-green leading-none z-10"
              style="view-transition-name: asterisk-accent"
            >
              *
            </div>
            
            <!-- Left column content -->
            <div class="flex-1 p-60px pt-60px pb-60px pl-100px pr-60px overflow-auto layout-image-right">
              <slot />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right side: Image on blue background -->
      <div class="relative flex items-center justify-center px-16">
        <div class="max-w-600px w-full h-full flex items-center justify-center py-12">
          <div v-if="image" class="rounded-lg overflow-hidden shadow-2xl max-h-full border-4 border-white">
            <img :src="image" :class="imgClass" alt="Slide image" />
          </div>
          <div v-else class="text-white text-center opacity-50">
            <p class="text-xl">No image specified</p>
            <p class="text-sm mt-2">Add <code class="bg-white/20 px-2 py-1 rounded">image: /path/to/image.png</code> to frontmatter</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

