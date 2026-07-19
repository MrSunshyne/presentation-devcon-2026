<script setup lang="ts">
interface Props {
  size?: 'default' | 'intro' | 'large'
  centerContent?: boolean
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  centerContent: false,
  noPadding: false,
})

// Calculate dimensions based on size
const dimensions = {
  large: {
    width: 'min(95%, 1000px)',
    height: 'min(85%, 700px)',
    padding: 'p-0',
  },
  default: {
    width: 'min(90%, 1400px)',
    height: 'min(85%, 800px)',
    padding: 'p-8',
  },
  intro: {
    width: 'min(75%, 1100px)',
    height: 'min(70%, 650px)',
    padding: 'p-12',
  },
}

const current = dimensions[props.size]
</script>

<template>
  <div 
    class="absolute inset-0 flex items-center justify-center z-1"
    :class="current.padding"
  >
    <div 
      class="card-stack-grid" 
      :style="{ width: current.width, height: current.height }"
    >
      <!-- Yellow card (bottom) -->
      <div 
        class="card-layer card-layer-yellow bg-theme-yellow rounded-12px border-4 border-black shadow-2xl"
        style="view-transition-name: card-layer-yellow"
      ></div>
      
      <!-- Orange card (middle) -->
      <div 
        class="card-layer card-layer-orange bg-theme-orange rounded-12px border-4 border-black shadow-2xl"
        style="view-transition-name: card-layer-orange"
      ></div>
      
      <!-- White card (top) -->
      <div 
        class="card-layer card-layer-white bg-white rounded-12px border-4 border-black shadow-2xl flex flex-col overflow-hidden"
        style="view-transition-name: card-layer-white"
      >
        <!-- Green asterisk accent -->
        <div 
          class="absolute top-30px right-30px text-64px font-bold text-theme-green leading-none z-10"
          style="view-transition-name: asterisk-accent"
        >
          *
        </div>
        
        <!-- Content area -->
        <div 
          class="flex-1 overflow-auto"
          :class="{ 
            'flex items-center justify-center p-60px': centerContent,
            'p-30px pt-30px pb-40px px-40px': !centerContent && !noPadding,
            'p-0': noPadding

          }"
        >
          <div :class="centerContent ? 'text-center max-w-900px' : 'h-full'">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-stack-grid {
  display: grid;
  grid-template-areas: "card";
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.card-layer {
  grid-area: card;
  position: relative;
}

.card-layer-yellow {
  transform: translate(40px, 40px);
  z-index: 1;
}

.card-layer-orange {
  transform: translate(20px, 20px);
  z-index: 2;
}

.card-layer-white {
  z-index: 3;
}

.shrink {
  .card-layer-yellow, .card-layer-orange {
    transform: scale(0.9);
  }
}
</style>
