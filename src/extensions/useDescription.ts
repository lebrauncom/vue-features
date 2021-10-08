import { useIdentified, ensureElementFromExtendable } from '../extracted'
import type { Extendable } from '../extracted'

export type Description = ReturnType<typeof useIdentified>

export function useDescription (extendable: Extendable): Description {
  return useIdentified({
    identifying: ensureElementFromExtendable(extendable),
    attribute: 'ariaDescribedby'
  })
}
