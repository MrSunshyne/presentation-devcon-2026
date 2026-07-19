// The deck registers its own WebMCP tools, so an agent (e.g. the Model
// Context Tool Inspector extension) can drive the presentation.
import { reactive, toValue } from 'vue'

export const deckTools = reactive({
  supported: false,
  names: [] as string[],
  log: [] as string[],
})

let registered = false

interface NavLike {
  next: () => void
  prev: () => void
  go: (n: number) => void
  currentPage: unknown
  total: unknown
}

export async function registerDeckTools(nav: NavLike) {
  if (registered || typeof document === 'undefined') return
  registered = true
  const mc = (document as any).modelContext
  if (!mc?.registerTool) return
  deckTools.supported = true

  const text = (t: string) => ({ content: [{ type: 'text', text: t }] })
  const note = (entry: string) => {
    deckTools.log.unshift(entry)
    if (deckTools.log.length > 6) deckTools.log.pop()
  }
  // nav actions resolve through the router - settle before reading the position
  const position = async () => {
    await new Promise(resolve => setTimeout(resolve, 80))
    return `slide ${toValue(nav.currentPage)} of ${toValue(nav.total)}`
  }

  const tools = [
    {
      name: 'next_slide',
      description: 'Advance the presentation to the next step or slide.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: false },
      async execute() {
        await nav.next()
        note('next_slide')
        return text(`Advanced. Now on ${await position()}.`)
      },
    },
    {
      name: 'previous_slide',
      description: 'Go back to the previous step or slide.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        await nav.prev()
        note('previous_slide')
        return text(`Went back. Now on ${await position()}.`)
      },
    },
    {
      name: 'go_to_slide',
      description: 'Jump straight to a slide by its number.',
      inputSchema: {
        type: 'object',
        properties: { number: { type: 'integer', description: 'The slide number, starting at 1' } },
        required: ['number'],
      },
      async execute({ number }: { number: number }) {
        await nav.go(number)
        note(`go_to_slide { number: ${number} }`)
        return text(`Jumped. Now on ${await position()}.`)
      },
    },
    {
      name: 'where_are_we',
      description: 'Report the current slide number and the total number of slides.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      async execute() {
        note('where_are_we')
        return text(`Currently on ${await position()}.`)
      },
    },
  ]

  for (const tool of tools) {
    try {
      await mc.registerTool(tool)
      deckTools.names.push(tool.name)
    } catch (err) {
      console.warn(`Could not register deck tool ${tool.name}`, err)
    }
  }
}
