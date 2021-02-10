import { onMounted, onBeforeUnmount, watch } from 'vue'
import { ensureTargets } from '../util'

export default function useListeners ({ target: rawTargets, listeners: rawListeners }) {
  const targets = ensureTargets(rawTargets),
        listeners = Object.entries(rawListeners).map(([type, rawListener]) => ({ type, listener: ensureListener(rawListener) })),
        activeListeners = [],
        effect = () => {
          listeners.forEach((listener, listenerIndex) => {
            cleanup(listenerIndex)

            targets.value.forEach((target, index) => {
              if (!target) {
                return
              }

              if (!activeListeners.find(({ target: t, index: i, listenerIndex: l }) => t === target && i === index && l === listenerIndex)) {
                const { type, listener: { targetClosure, options } } = listener,
                      callback = event => targetClosure({ target, index })(event)

                target.addEventListener(type, callback, options)

                activeListeners.push({ target, index, listenerIndex, type, callback, options })
              }
            })
          })
        },
        cleanup = listenerIndex => {
          const listenersToRemove = typeof listenerIndex === 'number'
            ? activeListeners.filter(({ listenerIndex: l }) => l === listenerIndex)
            : activeListeners

          listenersToRemove.forEach(({ target, type, callback, options }) => {
            target.removeEventListener(type, callback, options)
          })
        }
  
  onMounted(() => {
    effect()
    watch(
      [() => targets.value],
      effect,
      { flush: 'post' }
    )
  })

  onBeforeUnmount(() => cleanup())
}

function ensureListener (rawListener) {
  return typeof rawListener === 'function'
    ? { targetClosure: () => rawListener }
    : {
        targetClosure: rawListener?.targetClosure || (() => rawListener.callback),
        options: rawListener.options,
      }
}
