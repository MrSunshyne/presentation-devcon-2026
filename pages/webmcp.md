---
transition: view-transition
layout: center
---

# The next user of your website is an agent {.inline-block.view-transition-title}

<!--
Second act - same title as my blog post on this. Agents already browse: they book, compare, order, fill forms. The question is what we give them to work with.
-->

---
layout: default
---

# How an agent uses your site today

<div class="mt-6"></div>

- screenshot the page
- *guess* what the buttons do
- click and hope

<div v-click class="mt-10 text-2xl font-bold text-theme-orange">
Thousands of tokens to press one button.
</div>

<!--
Vision-based agents drive sites like a robot holding a mouse. Slow, brittle, expensive - and invisible to you as the site owner.
-->

---
layout: center
---

# WebMCP

<p class="op-70">Your page registers <strong>tools</strong> - typed functions an agent can call.</p>

<p class="mt-6 op-50 text-base">Google + Microsoft · origin trial in Chrome 149 → 156 · target: 157</p>

<!--
WebMCP = the page hands agents a typed API instead of pixels. Borrowed vocabulary from Anthropic's MCP, but web-native: the tools run in your page, in the user's session. Joint Google/Microsoft proposal, in origin trial right now.
-->

---
layout: default
---

# Register a tool

```js
await document.modelContext.registerTool({
  name: 'add_to_order',
  description: 'Add an item to the current order.',
  inputSchema: {
    type: 'object',
    properties: {
      item: { type: 'string' },
      quantity: { type: 'number' },
    },
    required: ['item'],
  },
  async execute({ item, quantity = 1 }) {
    addToOrder(item, quantity);
    return { content: [{ type: 'text', text: `Added ${quantity} × ${item}` }] };
  },
});
```

<!--
The imperative API. Name, description, JSON schema, execute. The description is literally the prompt the agent reads. Note: document.modelContext - early articles say navigator.modelContext, already renamed. That's how young this is.
-->

---
layout: default
---

# Or just annotate a form

```html
<form toolname="search-flights"
      tooldescription="Search flights from Mauritius">
  <input name="destination" required
         toolparamdescription="Airport or city, e.g. Paris">
  <input name="date" type="date">
  <button type="submit">Search</button>
</form>
```

<div v-click class="mt-6">

```css
form:tool-form-active { outline: 3px solid gold; }
```

</div>

<!--
The declarative API: three attributes turn a form you already have into a tool. And there's a CSS pseudo-class to show when an AGENT is using your form - agent activity as a styling concern. My favourite detail in the whole spec.
-->

---
layout: default
---

# This deck is agent-ready

<DeckToolsStatus />

<!--
Live moment: the slides you're watching registered their own WebMCP tools when they loaded. With the Model Context Tool Inspector extension I can type "go to the summarizer slide" and the deck obeys. If WebMCP is off in this browser the panel says so - flag: enable-webmcp-testing.
-->

---
layout: default
---

# Careful what you hand them

<div class="mt-6"></div>

- the agent inherits your **logged-in session**
- tool descriptions are **prompts** - poisoned ones hijack agents
- a tool named `finalizeCart` can do anything it wants

<div v-click class="mt-8 text-2xl font-bold text-theme-orange">
Mark tools read-only. Keep a human on the confirm button.
</div>

<!--
Security beat, kept short: this is the same power that makes it useful. The spec ships annotations (readOnlyHint, untrustedContentHint) and a human-in-the-loop API. Researchers already demonstrated mid-session tool swapping. Design for a hostile fairground.
-->

---
layout: center
---

# Now put them together

<p class="op-70">WebMCP exposes your page's tools.<br>The built-in model can call them.</p>

<p v-click class="mt-8 text-theme-yellow font-bold text-3xl">Nothing leaves the machine.</p>

<!--
The finale setup: an agent built from parts the browser already ships. Prompt API for reasoning, WebMCP tools for acting. No server, no API key - works in airplane mode.
-->

---
layout: default
---

# The dholl puri stand

<AgentStand />

<!--
The dholl puri stand. Type an order in Creole or English - "2 dholl puri ek enn alouda" - and the on-device model parses it into tool calls against the same WebMCP tools an external agent would use. Schema-constrained output, so the JSON is always valid. Then kill the Wi-Fi and do it again.
-->

---
layout: default
class: big-code
---

# The whole agent - three lines

<div class="mt-6"></div>

```js
const session = await LanguageModel.create();

const reply = await session.prompt(customerRequest, {
  responseConstraint: menuSchema,
});

JSON.parse(reply).actions.forEach(addToOrder);
```

<!--
The finale, minus plumbing: responseConstraint takes a JSON schema, so the reply always parses - no "please answer in JSON" begging. Brain (Prompt API), hands (the tools), zero network.
-->
