---
transition: view-transition
layout: center
---

# The Task APIs {.inline-block.view-transition-title}

<p class="op-70">The built-in model, exposed as small single-purpose APIs.</p>

<!--
Instead of one "do anything" endpoint, Chrome exposes the model through task-shaped APIs. Each is a global object with the same lifecycle.
-->

---
layout: default
---

# The family

<ApiFamily />

<!--
Three task APIs have been stable for over a year. The Prompt API — the raw model — went stable on the web in Chrome 148, May 2026. Writer/Rewriter/Proofreader finished origin trials and haven't graduated: on stable Chrome they're simply absent.
-->

---
layout: default
---

# This browser, right now

<AvailabilityBoard />

<!--
Live: these chips are feature-detection running in THIS browser. Four states: unavailable, downloadable, downloading, available. A downloadable chip becomes a progress bar when clicked — the download needs a user gesture, by design. If something is red on stage: that's the availability story doing its job. Ask the room to open the same URL.
-->

---
layout: default
---

# One pattern everywhere

```js
if (await Summarizer.availability() === 'unavailable') {
  // fall back — a server, or just don't offer the feature
}

const summarizer = await Summarizer.create({
  type: 'key-points',
  monitor: (m) => m.addEventListener('downloadprogress',
    (e) => progress.value = e.loaded),
});

const summary = await summarizer.summarize(longText);
```

<!--
The whole family shares this lifecycle: availability → create (with download progress) → use → destroy. Learn it once, you know all six APIs. create() that triggers a download must come from a click — no silent 4 GB downloads.
-->

---
layout: default
---

# Summarizer

<SummarizerDemo />

<!--
Live. The paragraph is about browser history — headline mode is the crowd-pleaser. Streaming, on-device. Offer to summarize text from the room.
-->

---
layout: default
---

# Language Detector → Translator

<TranslateDemo />

<!--
Live. Two APIs chained: detect the language (with confidence), then translate to the target. Each language pair is its own small download — watch the packs arrive on first use. Multilingual audience = ask for a sentence.
-->

---
layout: default
---

# The ones in limbo

<div class="mt-6"></div>

- `Writer` · `Rewriter` — origin trial ended at Chrome 148
- `Proofreader` — origin trial ended at 145
- not shipped, not killed — waiting

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
Upgrading Chrome makes them <em>disappear</em>, not appear.
</div>

<!--
Fun quirk: on Chrome 149 stable these globals don't exist at all — people assume "newer Chrome = more APIs" and it's the opposite here. Flags bring them back for demos. Lesson: origin-trial APIs are rentals, not purchases.
-->

---
layout: default
---

# Already in production

<div class="mt-6"></div>

- **Trip.com** — on-device travel summaries
- **Drupal** — headlines & SEO meta in the editor
- **Yahoo! Japan** — comment moderation, client-side

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
Moderation without sending comments to a server.
</div>

<!--
Not toys — shipped features. The Yahoo! Japan one is my favourite: toxicity checking where the comment never leaves the reader's machine. Privacy-preserving by architecture.
-->

---
layout: center
---

# What would <span class="text-theme-yellow">you</span> build?

<p class="op-70">Everything you just saw runs in the tab. No server involved.</p>

<!--
Pause here. Give the room 20 seconds. Some seeds: summarize a long email thread, translate customer reviews in place, auto-tag support tickets, form autofill from a pasted paragraph… Collect answers before moving on.
-->
