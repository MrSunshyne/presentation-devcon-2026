<script setup lang="ts">
// Simple centered layout without card layers
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
    
    <!-- Centered content without cards -->
    <div class="absolute inset-0 flex items-center justify-center z-1 p-16">
      <div class="text-center max-w-4xl w-full layout-center">
        <slot />
      </div>
    </div>
  </div>
</template>

