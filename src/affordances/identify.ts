import { ref, computed, isRef } from 'vue'
import type { Ref, ComputedRef, WatchSource } from 'vue'
import { nanoid } from 'nanoid/non-secure'
import {
  ensureElementsFromAffordanceElement,
  schedule,
  ensureWatchSources,
  createToEffectedStatus,
  useEffecteds,
} from '../extracted'
import type { BindElement } from '../extracted'

export type IdentifyOptions = {
  watchSource?: WatchSource | WatchSource[],
}

export type Id<BindElementType extends BindElement> = BindElementType extends (HTMLElement | Ref<HTMLElement>)
  ? ComputedRef<string>
  : BindElementType extends (HTMLElement[] | Ref<HTMLElement[]>)
    ? ComputedRef<string[]>
    : never

export function identify<BindElementType extends BindElement> (
  { element }: { element: BindElementType },
  options: IdentifyOptions = {}
): Id<BindElementType> {
  const ids = ref<string[]>([]),
        ensuredElements = ensureElementsFromAffordanceElement(element),
        ensuredWatchSources = ensureWatchSources(options.watchSource),
        effecteds = useEffecteds(),
        nanoids = new WeakMap<HTMLElement, string>(),
        effect = () => {
          effecteds.value.clear()

          ids.value = ensuredElements.value.map((element, index) => {
            if (!element) {
              return
            }

            effecteds.value.set(element, index)

            if (!nanoids.get(element)) {
              nanoids.set(element, nanoid(8))
            }

            return !!element.id ? element.id : nanoids.get(element)
          })
        }
  
  schedule({
    effect,
    watchSources: [ensuredElements, ...ensuredWatchSources],
    toEffectedStatus: createToEffectedStatus(effecteds),
  })

  if (isRef(element)) {
    if (Array.isArray(element.value) && element.value.every(element => element instanceof HTMLElement)) {
      return computed(() => ids.value) as Id<BindElementType>
    }

    return computed(() => ids.value[0]) as Id<BindElementType>
  }

  if (Array.isArray(element)) {
    return computed(() => ids.value) as Id<BindElementType>
  }

  return computed(() => ids.value[0]) as Id<BindElementType>
}
