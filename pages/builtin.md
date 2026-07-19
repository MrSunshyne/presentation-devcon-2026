---
layout: default
---

# What that buys you

<div class="mt-6"></div>

- **offline** - no network after the one-time download
- **local** - your text never leaves the machine
- **fast** - no round trip, streams in milliseconds
- **free** - no API key, no tokens, no bill

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
And it's small. It won't write your thesis.
</div>

<!--
The trade: a small model can't do complex reasoning. But summarize, translate, proofread, extract? That's exactly its size. Right tool, right job.
-->

---
layout: default
---

# Which model is it?

<div class="mt-6"></div>

- **Gemini Nano** - ~4 GB, sitting in your Chrome profile
- smaller **expert models** (Gemma, 197M) can serve some tasks
- Edge ships the *same APIs* with **Phi-4-mini** / **Aion**

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
The API is the contract - not the model.
</div>

<!--
Chrome docs deliberately don't promise which model serves which API. Check chrome://on-device-internals to see yours. Edge proves the point: identical API surface, completely different models underneath.
-->

---
layout: default
---

# The fine print

<div class="mt-6"></div>

- **22 GB** free disk for the download
- a GPU with **4+ GB VRAM** - or 16 GB RAM on CPU
- desktop & Chromebook Plus only, no mobile
- below 10 GB free disk, the model deletes itself

<!--
Honest slide. This is why availability checks are part of the API design, not an afterthought - you'll see them in every demo.
-->

---
layout: default
---

# Is this a web standard?

<div class="mt-6"></div>

- incubating in the W3C Web Machine Learning **Community Group**
- that's a proposal space - **not** the standards track

<div v-click class="mt-8">

- **Mozilla: negative** - same input, different output on every machine
- **WebKit: opposed** - interoperability, portability, privacy

</div>

<!--
The pushback matters. Firefox's core argument: a web API whose behaviour depends on which model your browser bundles isn't interoperable - the web's whole promise. Google's counter: progressive enhancement, availability states, feature detection. This fight is not settled - build with fallbacks.
-->
