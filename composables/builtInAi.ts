// Shared plumbing for the built-in AI demo components.
// Every create() that may trigger a model download must happen inside a user
// gesture — all demos run behind a button click for that reason.

export type AiState = 'missing' | 'unavailable' | 'downloadable' | 'downloading' | 'available'

export function hasGlobal(name: string): boolean {
  return typeof window !== 'undefined' && name in window
}

export async function stateOf(name: string, args?: unknown): Promise<AiState> {
  if (!hasGlobal(name)) return 'missing'
  try {
    return await (window as any)[name].availability(args)
  } catch {
    return 'unavailable'
  }
}

/** create() a session, surfacing download progress. Caller destroys it. */
export async function createSession(
  name: string,
  opts: Record<string, unknown> = {},
  onProgress?: (fraction: number) => void,
) {
  if (!hasGlobal(name)) {
    throw new Error(`${name} doesn't exist in this browser — it needs Chrome on desktop (for Writer/Rewriter/Proofreader, a chrome://flags entry).`)
  }
  return await (window as any)[name].create({
    ...opts,
    monitor(m: any) {
      m.addEventListener('downloadprogress', (e: any) => onProgress?.(e.loaded))
    },
  })
}
