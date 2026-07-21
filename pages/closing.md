---
layout: center
---

# No longer just a window

<ul>
<li v-click>the model moved <strong>into</strong> the browser</li>
<li v-click>the APIs are the contract, not the model</li>
<li v-click>your website is becoming a <strong>tool</strong> agents can use</li>
</ul>

<!--
Three takeaways, one each. Bookends the opening slide.
-->

---
layout: default
---

# Also cooking

<div class="mt-6"></div>

- **Embedding API** - semantic search on-device, explainer stage
- **WebNN** - bring your own model, on the real standards track
- the **Prompt API** already takes **images & audio** as input

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
Today's explainer is next year's origin trial.
</div>

<!--
Embedding API: on-device embeddings - similarity, semantic search, client-side RAG over your own data. Lives in explainers-by-googlers - the same nursery WebMCP grew up in, back when it was called script-tools. WebNN: the layer below all of this, and unlike the Prompt API it's in an actual W3C Working Group. Multimodal: shipped, not future - same prompt() call, content parts instead of a string.
If asked "what about users without the model": Firebase AI Logic hybrid - PREFER_ON_DEVICE with cloud fallback.
-->

---
layout: default
---

# What to watch

<div class="mt-6"></div>

- **Chrome 157** - WebMCP's target to ship
- Writer / Rewriter / Proofreader - graduation pending
- `github.com/webmachinelearning` - where it all incubates

<!--
Everything in this talk is moving. The origin trial ends at 156; if the TAG review and the WebKit objections don't derail it, WebMCP ships this year.
-->

---
layout: two-cols
---

# Try it yourself

<div class="mt-4 text-lg space-y-3">
  <div><carbon:logo-github /> MrSunshyne/<strong>chrome-tasks-api-demos</strong></div>
  <div><carbon:logo-github /> MrSunshyne/<strong>webmcp-demos</strong></div>
  <div><carbon:logo-github /> MrSunshyne/<strong>presentation-devcon-2026</strong></div>
  <div><carbon:blog /> sandeep.ramgolam.com</div>
</div>

::right::

<QRCode url="https://sandeep.ramgolam.com" title="All the links" instruction="Demos, slides & write-ups" />

<!--
Every demo in this talk is a public repo you can run with a static file server. The blog has the long-form write-ups.
-->

---
layout: center
---

# Questions ?

<p class="op-70">Sandeep Ramgolam · <strong>@MrSunshyne</strong> · sandeep.ramgolam.com</p>

<!--
Questions - or come find me, I have dholl puri opinions.
-->
