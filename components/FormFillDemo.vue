<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createSession } from '../composables/builtInAi'

const message = ref(
  'Bonzour! Sandeep here from Flying Dodo Labs - put me down for 3 seats '
  + 'at the workshop. No meat for me please, I\'m vegetarian. '
  + 'You can mail me on sandeep@dodo.mu',
)

const form = reactive({
  fullName: '',
  email: '',
  company: '',
  seats: '',
  diet: '',
})

// the contract IS the form: one property per field
const schema = {
  type: 'object',
  properties: {
    fullName: { type: 'string' },
    email: { type: 'string' },
    company: { type: 'string' },
    seats: { type: 'integer' },
    diet: { type: 'string', enum: ['none', 'vegetarian', 'vegan', 'halal'] },
  },
  required: ['fullName', 'email', 'company', 'seats', 'diet'],
}

const systemPrompt
  = 'You fill registration forms from free-form messages. Messages may be in '
  + 'English, French or Mauritian Creole. Use an empty string when a detail is missing.'

const status = ref('')
const busy = ref(false)
const justFilled = ref<Record<string, boolean>>({})

function clearForm() {
  for (const key of Object.keys(form)) (form as any)[key] = ''
  justFilled.value = {}
}

async function fill() {
  if (busy.value) return
  busy.value = true
  clearForm()
  status.value = 'waking the model…'
  let session: any
  try {
    session = await createSession(
      'LanguageModel',
      { initialPrompts: [{ role: 'system', content: systemPrompt }] },
      (f) => { status.value = `downloading model… ${Math.round(f * 100)}%` },
    )
    status.value = 'extracting, on-device…'
    const reply = await session.prompt(message.value, { responseConstraint: schema })
    const data = JSON.parse(reply)
    status.value = ''
    // drop the values in one by one - it reads better on stage
    for (const key of Object.keys(form)) {
      if (!(key in data)) continue
      ;(form as any)[key] = String(data[key] ?? '')
      justFilled.value = { ...justFilled.value, [key]: true }
      await new Promise(r => setTimeout(r, 220))
    }
    setTimeout(() => { justFilled.value = {} }, 900)
  } catch (err: any) {
    status.value = err?.message ?? String(err)
  } finally {
    session?.destroy?.()
    busy.value = false
  }
}
</script>

<template>
  <div class="demo">
    <div class="boxes">
      <div class="box">
        <p class="box-title">the message - edit me</p>
        <textarea v-model="message" rows="7" spellcheck="false" class="msg-edit" />
        <button class="go" :disabled="busy" @click="fill">Fill the form →</button>
        <span v-if="status" class="status">{{ status }}</span>
      </div>
      <div class="box form-box">
        <p class="box-title">the form - hands-free</p>
        <div class="fields">
          <label :data-flash="justFilled.fullName">
            <span>Full name</span>
            <input v-model="form.fullName" placeholder="—">
          </label>
          <label :data-flash="justFilled.email">
            <span>Email</span>
            <input v-model="form.email" placeholder="—">
          </label>
          <label :data-flash="justFilled.company">
            <span>Company</span>
            <input v-model="form.company" placeholder="—">
          </label>
          <label :data-flash="justFilled.seats">
            <span>Seats</span>
            <input v-model="form.seats" placeholder="—">
          </label>
          <label class="wide" :data-flash="justFilled.diet">
            <span>Diet</span>
            <select v-model="form.diet">
              <option value="" disabled>—</option>
              <option value="none">none</option>
              <option value="vegetarian">vegetarian</option>
              <option value="vegan">vegan</option>
              <option value="halal">halal</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <details class="box sys">
      <summary class="box-title">responseConstraint - one property per field</summary>
      <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
    </details>
  </div>
</template>

<style scoped>
.demo { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.55rem; }
.boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.box {
  border: 3px solid #000;
  border-radius: 12px;
  background: #fff;
  padding: 0.45rem 0.8rem;
}
.box-title { margin: 0 0 0.4rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
.msg-edit {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #1a1a1a;
  resize: none;
}
.go {
  border: 3px solid #000;
  border-radius: 999px;
  padding: 0.35rem 1.2rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  background: #ffd700;
  color: #1a1a1a;
  cursor: pointer;
}
.go:hover:not(:disabled) { background: #00d68f; }
.go:disabled { opacity: 0.5; cursor: wait; }
.status { display: block; margin-top: 0.35rem; font-size: 0.8rem; color: #666; font-family: monospace; }
.form-box { background: #fffbe6; }
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 0.7rem; }
.fields .wide { grid-column: 1 / -1; }
.fields label { display: flex; flex-direction: column; gap: 0.15rem; }
.fields span { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
.fields input,
.fields select {
  border: 2px solid #000;
  border-radius: 8px;
  padding: 0.28rem 0.6rem;
  font: inherit;
  font-size: 0.85rem;
  background: #fff;
  color: #1a1a1a;
  transition: background 0.4s ease, border-color 0.4s ease;
}
.fields label[data-flash='true'] input,
.fields label[data-flash='true'] select {
  background: #e6fff5;
  border-color: #00d68f;
}
.sys summary.box-title { margin: 0; cursor: pointer; }
.sys[open] summary.box-title { margin-bottom: 0.4rem; }
.sys pre { margin: 0; font-size: 0.7rem; line-height: 1.45; color: #1a1a1a; background: none; padding: 0; }
html.dark .demo .status { color: #94a3b8; }
html.dark .demo .box .box-title { color: #888; }
</style>
