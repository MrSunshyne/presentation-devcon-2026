# WebAI - exploring agentic capabilities within the browser

My slides for [Developers Conference 2026](https://2026.mscc.mu/agenda) in Mauritius.

Live at [mrsunshyne.github.io/presentation-devcon-2026](https://mrsunshyne.github.io/presentation-devcon-2026/) -
open it in Chrome, because the demos run inside the slides: the deck calls the
built-in AI APIs (Summarizer, Translator, Writer, Prompt API) and registers its own
WebMCP tools, so an agent can literally drive the presentation.

Built with [Slidev](https://sli.dev), same layered-cards theme as my coders.mu decks.

## Run it

```bash
pnpm install
pnpm dev
```

## Notes to self, before going on stage

- Flags on the demo machine: `chrome://flags/#enable-webmcp-testing`, plus the
  "gemini nano" ones so Writer/Rewriter/Proofreader exist at all.
- Every chip on the availability slide should be green in the greenroom. Download
  stuck at 0%? `chrome://components` → "Optimization Guide On Device Model" →
  Check for update, or relaunch Chrome.
- Translation packs are per language pair - run each target once beforehand,
  or leave one out on purpose to show the download live.
- The summarizer slide copies a console snippet - type "allow pasting" in the
  target window's DevTools before the talk, not during.
- Model Context Tool Inspector extension pinned, for driving the deck by agent.
- After all that, the whole talk runs with Wi-Fi off. Worth saying on stage.

## Related

- [chrome-tasks-api-demos](https://github.com/MrSunshyne/chrome-tasks-api-demos) - standalone demos for every task API
- [webmcp-demos](https://github.com/MrSunshyne/webmcp-demos) - the Dholl Puri Stand and friends
