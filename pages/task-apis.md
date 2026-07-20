---
layout: default
---

# Prompt API - the steering wheel

<PromptDemo />

<!--
Proof the model is really there: LanguageModel, direct access, stable since Chrome 148, no flags. Messy Creole message in, schema-valid JSON out - responseConstraint enforces the schema at generation time, so the reply parses every time. Remember this one: the finale is built on it. Everything that follows is the task-shaped dials around this same model.
The schema box is editable - add a field live (e.g. "mood": { "enum": ["chill", "formal"] } plus required) and rerun: the mask adapts instantly. The Kreol works because it lives next door to French, the prompt carries a three-word glossary, and the schema turns understanding into fill-in-the-blanks.
-->

---
layout: default
class: big-code
---

# Schema in, JSON out

<div class="mt-6"></div>

```js
const session = await LanguageModel.create();

const reply = await session.prompt(message, {
  responseConstraint: schema,
});

const data = JSON.parse(reply); // always valid
```

<!--
Two lines plus a parse. The schema is a plain JSON Schema object. Also takes images and audio as input on capable hardware - not shown today.
-->

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
Three task APIs have been stable for over a year. The Prompt API - the raw model - went stable on the web in Chrome 148, May 2026. Writer/Rewriter/Proofreader finished origin trials and haven't graduated: on stable Chrome they're simply absent.
-->

---
layout: default
---

# Status of the current browser

<AvailabilityBoard />

<!--
Live: these chips are feature-detection running in THIS browser. Four states: unavailable, downloadable, downloading, available. A downloadable chip becomes a progress bar when clicked - the download needs a user gesture, by design. If something is red on stage: that's the availability story doing its job. Ask the room to open the same URL.
-->

---
layout: default
---

# How to use

```js
if (await Summarizer.availability() === 'unavailable') {
  // fall back - a server, or just don't offer the feature
}

const summarizer = await Summarizer.create({
  type: 'key-points',
  monitor: (m) => m.addEventListener('downloadprogress',
    (e) => progress.value = e.loaded),
});

const summary = await summarizer.summarize(longText);
```

<!--
The whole family shares this lifecycle: availability → create (with download progress) → use → destroy. Learn it once, you know all six APIs. create() that triggers a download must come from a click - no silent 4 GB downloads.
-->

---
layout: default
---

# Summarizer

<SummarizerDemo />

<!--
Live. The paragraph is about browser history - headline mode is the crowd-pleaser. Streaming, on-device. Offer to summarize text from the room.
"copy the code" copies a console-ready snippet: it reads the page's own content via a selector ('main' by default - edit it in the console) and prints the summary right there, with the type picked on this slide. Open a blog post in another window, paste, done - any page, any console, same API. Arm the target console beforehand: Chrome makes you type "allow pasting" the first time.
Easter egg: the type dropdown is a native select styled with appearance: base-select - customizable selects, also new in Chrome. Worth pointing out to the CSS crowd.
-->

---
layout: default
class: big-code
---

# Summarizer API

<div class="mt-6"></div>

```js
const summarizer = await Summarizer.create({
  type: 'headline',
  outputLanguage: 'en',
});

const summary = await summarizer.summarize(text);
```

<!--
Everything you just watched. The availability check and download progress are the production wrapper - this is the whole API.
-->

---
layout: default
---

# Language Detector → Translator

<TranslateDemo />

<!--
Live. Two APIs chained: detect the language (with confidence), then translate to the target. Each language pair is its own small download - watch the packs arrive on first use. Multilingual audience = ask for a sentence.
-->

---
layout: default
class: big-code
---

# Detect &amp; translate API

<div class="mt-6"></div>

```js
const detector = await LanguageDetector.create();
const [top] = await detector.detect(text);

const translator = await Translator.create({
  sourceLanguage: top.detectedLanguage,
  targetLanguage: 'en',
});
const result = await translator.translate(text);
```

<!--
The chain from the demo: detector gives a ranked list with confidence, top hit feeds the translator. That's it.
-->

---
layout: default
---

# Writer & Rewriter

<WriterDemo />

<!--
These two run here because of a chrome://flags entry - the audience's stable Chrome doesn't even have the globals. Write the invite, then run it through the Rewriter dials.
The Rewriter's whole surface is three dials, all relative to the input: tone (more-formal / more-casual), length (shorter / longer), format - plus free-form context strings. No "make it rhyme": task APIs are dials, the Prompt API is the steering wheel. The next slide explains why your Chrome doesn't have these.
-->

---
layout: default
class: big-code
---

# Writer &amp; rewriter API

<div class="mt-6"></div>

```js
const writer = await Writer.create({ tone: 'neutral', length: 'short' });
const draft = await writer.write('Invite my neighbours for dholl puri');

const rewriter = await Rewriter.create({ tone: 'more-formal' });
const polished = await rewriter.rewrite(draft);
```

<!--
Writer authors from a brief with absolute dials; Rewriter nudges existing text with relative ones. Swap tone for length: 'shorter' - same shape.
-->

---
layout: default
---

# Note

<div class="mt-6"></div>

- `Writer` · `Rewriter` - origin trial ended at Chrome 148
- `Proofreader` - origin trial ended at 145
- not shipped, not killed - waiting

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
Upgrading Chrome makes them <em>disappear</em>, not appear.
</div>

<!--
Fun quirk: on Chrome 149 stable these globals don't exist at all - people assume "newer Chrome = more APIs" and it's the opposite here. Flags bring them back for demos. Lesson: origin-trial APIs are rentals, not purchases.
-->

---
layout: center
---

# What would <span class="text-theme-yellow">you</span> build?

<p class="op-70">Everything you just saw runs in the tab. No server involved.</p>

<!--
Pause here. Give the room 20 seconds. Some seeds: summarize a long email thread, translate customer reviews in place, auto-tag support tickets, form autofill from a pasted paragraph… Collect answers before moving on.
-->
