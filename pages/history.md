---
transition: view-transition
layout: center
---

# The browser is a window {.inline-block.view-transition-title}

<div class="browser-frame">
  <div class="browser-bar">
    <span class="dot" style="background:#ff6b4a"></span>
    <span class="dot" style="background:#ffd700"></span>
    <span class="dot" style="background:#00d68f"></span>
    <span class="url">https://the-web.mu</span>
  </div>
  <img src="/images/spider-wide.jpeg" alt="" class="browser-view view-transition-spider">
</div>

<p class="op-70">through which you can see the web.</p>

<style>
.browser-frame {
  width: min(58%, 560px);
  margin: 1.2rem auto 0.8rem;
  border: 4px solid #000;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.55);
  text-align: left;
}
.browser-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  background: #f1f5f9;
  border-bottom: 3px solid #000;
}
.browser-bar .dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 2px solid #000;
}
.browser-bar .url {
  margin-left: 0.6rem;
  flex: 1;
  background: #fff;
  border: 2px solid #000;
  border-radius: 999px;
  padding: 0.05rem 0.8rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #1a1a1a;
}
.browser-view {
  display: block;
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>

<!--
The photo from the previous slide shrinks into the browser chrome - the window becomes THE window. For 30 years this was the whole job: a viewport. The web happened on the other side of the glass.
-->

---
transition: view-transition
layout: center
---

# Can it execute tasks ? {.inline-block.view-transition-title}

<!--
The shift of the last two years: browsers stopped being just a window. They act on your behalf.
-->

---
layout: center
---

# Browsers always ran programs

<p class="op-70">JavaScript, built-in since <strong>1995</strong></p>

<!--
To be fair: browsers have shipped with a programming language for 30 years. Every page is a program.
-->

---
layout: center
---

# But they could not <span class="text-theme-yellow">think</span>

<p class="op-70">JavaScript runs. It doesn't reason.</p>

<!--
JS executes what we wrote. It never understood anything. Reasoning was the missing capability.
-->

---
layout: center
---

# That changed recently, brain as an API

<ul>
<li v-click>a model on someone else's server</li>
<li v-click>needs a network</li>
<li v-click>pay per token</li>
</ul>

<!--
LLMs gave software reasoning - but over HTTP. Latency, cost, and your data leaves the machine.
-->

---
layout: default
---

# 2025 - the AI browser wave

<div class="mt-8"></div>

- **Comet** - Perplexity
- **Atlas** - OpenAI
- **Dia** - The Browser Company
- ...and Copilot Mode, Neon, and more

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
All of them talk to a model in the cloud.
</div>

<!--
Last year every AI company shipped a browser. Ask the room who tried one. Common trait: the model is remote - the browser is just the steering wheel.
-->

---
layout: center
---

# What if the model shipped <span class="text-theme-yellow">with</span> the browser?

<!--
This is the turn of the talk. Not AI driving a browser - a model included in the browser, as a platform feature.
-->

---
layout: center
---

# Chrome ships one !

<p class="op-70">A small model, downloaded once, available to any website.</p>

<!--
Not a plugin, not an extension, not an account. It downloads once into your Chrome profile and every website can call it.
-->
