<template>
  <div class="audience-reactions">
    <!-- Status indicator (optional, can be hidden with :showStatus="false") -->
    <div v-if="showStatus" class="status">
      <span 
        class="status-indicator" 
        :class="{ connected: isConnected, disconnected: !isConnected }"
      ></span>
      {{ isConnected ? `${connectionCount} watching` : 'Connecting...' }}
    </div>

    <!-- Particle effects -->
    <div class="particles-container">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></div>
    </div>

    <!-- Emoji display area -->
    <div class="emoji-container" ref="emojiContainer">
      <div
        v-for="emoji in displayedEmojis"
        :key="emoji.id"
        class="flying-emoji"
        :class="[animationStyle, emoji.effectClass]"
        :style="emoji.style"
      >
        {{ emoji.emoji }}
        <!-- Emoji trail -->
        <!-- <div class="emoji-trail"></div> -->
        <div class="emoji-glow"></div>
      </div>
    </div>


    <!-- Controls - only show if not in presenter mode or if explicitly enabled -->
    <div v-if="showControls" class="controls">
      <div class="emoji-buttons">
        <button
          v-for="(emoji, index) in emojis"
          :key="emoji"
          class="emoji-button"
          :class="{ 'button-active': lastSent === emoji }"
          @click="sendEmoji(emoji)"
          @mousedown="createButtonRipple"
          :disabled="!isConnected"
          :title="`Send ${emoji}`"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ emoji }}
          <div class="button-shine"></div>
        </button>
      </div>
      
      <div v-if="showAnimationSelector" class="animation-selector">
        <label>
          <input type="radio" value="center" v-model="animationStyle" />
          <span>Center</span>
        </label>
        <label>
          <input type="radio" value="random" v-model="animationStyle" />
          <span>Random</span>
        </label>
        <label>
          <input type="radio" value="spiral" v-model="animationStyle" />
          <span>Spiral</span>
        </label>
        <label>
          <input type="radio" value="burst" v-model="animationStyle" />
          <span>Burst</span>
        </label>
        <label>
          <input type="radio" value="firework" v-model="animationStyle" />
          <span>Firework</span>
        </label>
        <label>
          <input type="radio" value="bounce" v-model="animationStyle" />
          <span>Bounce</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PartySocket from 'partysocket'

interface Props {
  // PartyKit host (defaults to localhost for dev)
  host?: string
  // Room name (defaults to 'audience')
  room?: string
  // Available emojis (defaults to common reactions)
  emojis?: string[]
  // Show the controls (defaults to true)
  showControls?: boolean
  // Show the status indicator (defaults to true)
  showStatus?: boolean
  // Show animation selector (defaults to false for cleaner presenter view)
  showAnimationSelector?: boolean
  // Default animation style
  defaultAnimation?: 'center' | 'random' | 'spiral' | 'burst' | 'firework' | 'bounce'
}

const props = withDefaults(defineProps<Props>(), {
  host: 'localhost:1999',
  room: 'audience',
  emojis: () => ['👍', '❤️', '😂', '🎉', '🔥', '👏'],
  showControls: true,
  showStatus: true,
  showAnimationSelector: false,
  defaultAnimation: 'random'
})

interface EmojiDisplay {
  id: string
  emoji: string
  style: Record<string, string>
  effectClass?: string
}

interface Particle {
  id: string
  style: Record<string, string>
}

interface Ripple {
  id: string
  style: Record<string, string>
}

const isConnected = ref(false)
const connectionCount = ref(0)
const displayedEmojis = ref<EmojiDisplay[]>([])
const animationStyle = ref<'center' | 'random' | 'spiral' | 'burst' | 'firework' | 'bounce'>(props.defaultAnimation)
const emojiContainer = ref<HTMLElement | null>(null)
const particles = ref<Particle[]>([])
const ripples = ref<Ripple[]>([])
const lastSent = ref<string>('')

let socket: PartySocket | null = null

function getRandomPosition() {
  // Spawn anywhere on screen with some margin
  const x = Math.random() * 80 + 10  // 10% to 90%
  const y = Math.random() * 80 + 10  // 10% to 90%
  return { x, y }
}

function getCenterPosition() {
  return { x: 50, y: 50 }
}

function getSpiralPosition(index: number) {
  const angle = index * 0.5
  const radius = 30
  const x = 50 + Math.cos(angle) * radius
  const y = 50 + Math.sin(angle) * radius
  return { x, y }
}

function getBurstPosition() {
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * 40 + 10
  const x = 50 + Math.cos(angle) * distance
  const y = 50 + Math.sin(angle) * distance
  return { x, y }
}

function createParticles(x: number, y: number) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12
    const velocity = Math.random() * 100 + 50
    const particleId = `particle-${Date.now()}-${i}`
    
    particles.value.push({
      id: particleId,
      style: {
        left: `${x}%`,
        top: `${y}%`,
        '--vx': `${Math.cos(angle) * velocity}px`,
        '--vy': `${Math.sin(angle) * velocity}px`,
        '--hue': `${Math.random() * 360}deg`,
      }
    })
    
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== particleId)
    }, 1000)
  }
}

function createRipple(x: number, y: number) {
  const rippleId = `ripple-${Date.now()}`
  ripples.value.push({
    id: rippleId,
    style: {
      left: `${x}%`,
      top: `${y}%`,
    }
  })
  
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== rippleId)
  }, 1000)
}

function addEmoji(emoji: string, id: string) {
  let style: Record<string, string>
  let pos: { x: number, y: number }
  let effectClass = ''
  
  const emojiIndex = displayedEmojis.value.length
  
  switch (animationStyle.value) {
    case 'center':
      pos = getCenterPosition()
      break
    case 'spiral':
      pos = getSpiralPosition(emojiIndex)
      effectClass = 'spin'
      break
    case 'burst':
      pos = getBurstPosition()
      effectClass = 'wobble'
      break
    case 'firework':
      pos = getCenterPosition()
      effectClass = 'explode'
      createParticles(pos.x, pos.y)
      break
    case 'bounce':
      pos = { x: Math.random() * 80 + 10, y: 20 }
      effectClass = 'bounce-effect'
      break
    default:
      pos = getRandomPosition()
  }
  
  style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
  }
  
  // Create ripple effect
  createRipple(pos.x, pos.y)
  
  displayedEmojis.value.push({
    id,
    emoji,
    style,
    effectClass
  })
  
  // Remove emoji after animation completes
  const duration = animationStyle.value === 'bounce' ? 3000 : 2000
  setTimeout(() => {
    displayedEmojis.value = displayedEmojis.value.filter(e => e.id !== id)
  }, duration)
}

function createButtonRipple(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  const rect = button.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  
  const ripple = document.createElement('div')
  ripple.className = 'button-ripple-effect'
  ripple.style.left = `${x}%`
  ripple.style.top = `${y}%`
  
  button.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

function sendEmoji(emoji: string) {
  if (!socket || !isConnected.value) return
  
  socket.send(JSON.stringify({
    type: 'emoji',
    emoji
  }))
  
  lastSent.value = emoji
  setTimeout(() => {
    lastSent.value = ''
  }, 500)
}

function connectToParty() {
  console.log('🔌 AudienceReactions connecting to:', props.host)
  
  // Check if using Cloudflare Worker (contains .workers.dev or localhost:8787)
  const isCloudflareWorker = props.host.includes('.workers.dev') || props.host.includes('localhost:8787')
  
  if (isCloudflareWorker) {
    // Direct WebSocket connection for Cloudflare Worker
    const protocol = props.host.includes('localhost') ? 'ws' : 'wss'
    const wsUrl = `${protocol}://${props.host}/room/${props.room}`
    console.log('📡 Connecting to Cloudflare Worker:', wsUrl)
    socket = new WebSocket(wsUrl) as any
  } else {
    // PartyKit connection
    socket = new PartySocket({
      host: props.host,
      room: props.room
    })
  }
  
  if (!socket) return
  
  socket.addEventListener('open', () => {
    console.log('✅ AudienceReactions connected!')
    isConnected.value = true
  })
  
  socket.addEventListener('close', () => {
    console.log('❌ AudienceReactions connection closed')
    isConnected.value = false
  })
  
  socket.addEventListener('error', (error) => {
    console.error('❌ AudienceReactions WebSocket error:', error)
  })
  
  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data)
      
      if (data.type === 'emoji') {
        addEmoji(data.emoji, data.id)
      } else if (data.type === 'connection_count') {
        connectionCount.value = data.count
      } else if (data.type === 'error') {
        console.error('Server error:', data.message)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })
}

onMounted(() => {
  connectToParty()
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
})
</script>

<style scoped>
.audience-reactions {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Particles */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 40;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(45deg, 
    hsl(var(--hue), 100%, 50%), 
    hsl(calc(var(--hue) + 60deg), 100%, 70%)
  );
  box-shadow: 0 0 10px currentColor;
  animation: particleFloat 1s ease-out forwards;
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--vx), var(--vy)) scale(0);
    opacity: 0;
  }
}

/* Ripples */
.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 45;
}

.ripple {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(255, 0, 255, 0.8);
  transform: translate(-50%, -50%);
  animation: rippleExpand 1s ease-out forwards;
}

@keyframes rippleExpand {
  0% {
    width: 50px;
    height: 50px;
    opacity: 1;
    border-width: 3px;
  }
  100% {
    width: 300px;
    height: 300px;
    opacity: 0;
    border-width: 0;
  }
}

.emoji-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.flying-emoji {
  position: absolute;
  font-size: 32px;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  z-index: 50;
}

.emoji-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: trailPulse 0.5s ease-out infinite;
  z-index: -1;
}

.emoji-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(0, 255, 64, 0.4) 0%, transparent 60%);
  animation: glowPulse 1s ease-in-out infinite;
  z-index: -2;
}

@keyframes trailPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

@keyframes glowPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
}

/* Center animation */
.flying-emoji.center {
  animation: float-center 2s ease-out forwards;
}

@keyframes float-center {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)) brightness(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.8)) brightness(1.5);
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5) translateY(-150px) rotate(360deg);
    opacity: 0;
    filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.8)) brightness(2);
  }
}

/* Random animation */
.flying-emoji.random {
  animation: float-random 2s ease-out forwards;
}

@keyframes float-random {
  0% {
    transform: scale(0) translateY(0);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
  50% {
    transform: scale(1.2) translateY(-200px);
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.6));
  }
  100% {
    transform: scale(1.5) translateY(-400px);
    opacity: 0;
    filter: drop-shadow(0 0 30px rgba(255, 0, 255, 0.8));
  }
}

/* Spiral animation */
.flying-emoji.spiral {
  animation: float-spiral 2s ease-out forwards;
}

@keyframes float-spiral {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2) translateY(-300px) rotate(1080deg);
    opacity: 0;
  }
}

.flying-emoji.spin {
  animation: spin 2s linear forwards;
}

@keyframes spin {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(1080deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.5) rotate(2160deg);
    opacity: 0;
  }
}

/* Burst animation */
.flying-emoji.burst {
  animation: float-burst 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes float-burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3) translateY(-200px);
    opacity: 0;
  }
}

.flying-emoji.wobble {
  animation: wobble 2s ease-out forwards;
}

@keyframes wobble {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: scale(1.2) rotate(-15deg);
  }
  50% {
    transform: scale(1.5) rotate(15deg);
    opacity: 1;
  }
  75% {
    transform: scale(1.8) rotate(-10deg);
  }
  100% {
    transform: scale(2) rotate(0deg) translateY(-300px);
    opacity: 0;
  }
}

/* Firework animation */
.flying-emoji.firework {
  animation: float-firework 2s ease-out forwards;
}

@keyframes float-firework {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1)) brightness(2);
  }
  30% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 1;
    filter: drop-shadow(0 0 40px rgba(255, 0, 255, 1)) brightness(3);
  }
  100% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
    filter: drop-shadow(0 0 60px rgba(0, 255, 255, 1)) brightness(4);
  }
}

.flying-emoji.explode {
  animation: explode 2s ease-out forwards;
}

@keyframes explode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    filter: brightness(3) drop-shadow(0 0 30px rgba(255, 255, 255, 1));
  }
  50% {
    transform: scale(2) rotate(180deg);
    opacity: 1;
    filter: brightness(5) drop-shadow(0 0 50px rgba(255, 0, 255, 1));
  }
  100% {
    transform: scale(4) rotate(360deg);
    opacity: 0;
    filter: brightness(1) drop-shadow(0 0 80px rgba(0, 255, 255, 1));
  }
}

/* Bounce animation */
.flying-emoji.bounce {
  animation: float-bounce 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes float-bounce {
  0% {
    transform: translateY(0) scale(0) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: translateY(50px) scale(1.2) rotate(180deg);
    opacity: 1;
  }
  40% {
    transform: translateY(0px) scale(1.5) rotate(360deg);
  }
  60% {
    transform: translateY(30px) scale(1.8) rotate(540deg);
  }
  80% {
    transform: translateY(-100px) scale(2) rotate(720deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-400px) scale(0.5) rotate(1080deg);
    opacity: 0;
  }
}

.flying-emoji.bounce-effect {
  animation: bounceEffect 3s ease-out forwards;
}

@keyframes bounceEffect {
  0%, 20%, 40%, 60%, 80% {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  0% {
    transform: scale(0) translateY(0);
    opacity: 1;
  }
  20% {
    transform: scale(1.2) translateY(0);
  }
  40% {
    transform: scale(1.4) translateY(-100px);
  }
  60% {
    transform: scale(1.6) translateY(-50px);
  }
  80% {
    transform: scale(1.8) translateY(-150px);
    opacity: 1;
  }
  100% {
    transform: scale(2) translateY(-500px);
    opacity: 0;
  }
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1));
  backdrop-filter: blur(15px);
  padding: 15px;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
  z-index: 100;
}

.status-indicator {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-indicator.connected {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-indicator.disconnected {
  background: #ef4444;
}

.emoji-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.emoji-button {
  font-size: 32px;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: buttonFloat 3s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(255, 0, 255, 0.1), 
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@keyframes buttonFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(1deg); }
  75% { transform: translateY(2px) rotate(-1deg); }
}

.button-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 70%);
  animation: shine 3s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.emoji-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.3) 0%, rgba(0, 255, 255, 0.3) 100%);
  transform: scale(1.2) rotate(5deg);
  border-color: rgba(255, 0, 255, 0.6);
  box-shadow: 0 8px 25px rgba(255, 0, 255, 0.5), 
              0 0 30px rgba(255, 0, 255, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.emoji-button:active:not(:disabled) {
  transform: scale(0.9) rotate(0deg);
}

.emoji-button.button-active {
  animation: buttonPop 0.4s ease-out;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.4) 0%, rgba(0, 255, 255, 0.4) 100%);
}

@keyframes buttonPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4) rotate(15deg); }
  100% { transform: scale(1); }
}

.emoji-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.button-ripple-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  animation: rippleEffect 0.6s ease-out;
  pointer-events: none;
}

@keyframes rippleEffect {
  to {
    transform: translate(-50%, -50%) scale(8);
    opacity: 0;
  }
}

.animation-selector {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  flex-wrap: wrap;
  justify-content: center;
}

.animation-selector label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.animation-selector label:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.animation-selector input[type="radio"] {
  cursor: pointer;
}

.animation-selector input:checked + span {
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
  font-weight: bold;
}
</style>


