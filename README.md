# The Browser That Thinks — DevCon 2026

Slides for my Developers Conference 2026 talk on on-device AI and the agentic web.
Built with [Slidev](https://sli.dev), using the same layered-cards theme as my
coders.mu decks. The demos run *inside* the slides — Slidev is a web page, so the
deck itself calls the built-in AI APIs and registers WebMCP tools.

## Run

```bash
pnpm install
pnpm dev
```

## What's live in the deck

| Slide | Component | Needs |
| --- | --- | --- |
| This browser, right now | `AvailabilityBoard` | nothing — feature detection always works |
| Summarizer | `SummarizerDemo` | foundation model downloaded |
| Language Detector → Translator | `TranslateDemo` | detector model + one pack per language pair |
| This deck is agent-ready | `DeckToolsStatus` | WebMCP flag (see below) |
| The dholl puri stand | `AgentStand` | foundation model; WebMCP optional |

The deck registers `next_slide` / `previous_slide` / `go_to_slide` / `where_are_we`
as WebMCP tools on every slide (see `composables/deckTools.ts`), so an agent like the
**Model Context Tool Inspector** extension can drive the presentation.

## Pre-stage checklist

- Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled (WebMCP), plus the
  "gemini nano" flags if I want Writer/Rewriter/Proofreader chips to exist.
- Model pre-downloaded: every chip on the availability slide should read `available`
  in the greenroom. Trigger downloads by clicking the `downloadable` chips.
- **If a download sticks at 0%** (happens after toggling the on-device AI setting):
  `chrome://components` → "Optimization Guide On Device Model" → **Check for update**,
  or quit and relaunch Chrome.
- Language packs are separate per pair — run the Translator demo once per target
  language I plan to show. Leaving one pack undownloaded is a feature: the audience
  gets to see the download arc live.
- Model Context Tool Inspector extension installed and pinned for the deck-driving bit.
- After that, the whole talk runs with Wi-Fi off — except the QR slide, which uses
  api.qrserver.com. Load it once before going offline.
- Rehearse the clean-machine story with a throwaway profile:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=$(mktemp -d)`

## Related repos

- [chrome-tasks-api-demos](https://github.com/MrSunshyne/chrome-tasks-api-demos) — standalone task-API demos
- [webmcp-demos](https://github.com/MrSunshyne/webmcp-demos) — Dholl Puri Stand & Pixel Painter
