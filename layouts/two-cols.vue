<script setup lang="ts">
import CardLayers from '../components/CardLayers.vue'
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
        <div class="relative" style="width: 500px; height: min(80%, 800px); margin-left: -50px;">
          <!-- Yellow card (bottom) -->
          <div 
            class="absolute w-full h-[80%] top-40px left-40px bg-theme-yellow rounded-12px border-4 border-black shadow-2xl z-1"
            style="view-transition-name: card-layer-yellow"
          ></div>
          
          <!-- Orange card (middle) -->
          <div 
            class="absolute w-full h-[90%] top-20px left-20px bg-theme-orange rounded-12px border-4 border-black shadow-2xl z-2"
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
            <div class="flex-1 p-30px pt-30px pb-30px pl-100px pr-30px overflow-auto layout-two-cols-left">
              <slot name="default" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right side: Content on blue background -->
      <div class="relative flex items-center justify-center px-16 opacity-0 appear">
        <div class="text-white max-w-550px w-full layout-two-cols-right">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.appear{
  animation: appear 0.5s ease-out 0.5s forwards;
}

@keyframes appear {
  from {
    opacity: 0;
    scale: 0.9;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
</style>