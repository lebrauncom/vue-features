import { unref } from 'vue'
import type { ListenableSupportedType, ListenOptions } from '@baleada/logic';
import type { OnEffectObject } from '../affordances'

export function ensureListenOptions<Type extends ListenableSupportedType> (options: OnEffectObject<Type>['options']['listen']): ListenOptions<Type> {
  if ('observer' in options && 'root' in options.observer) {
    return {
      observer: {
        ...options.observer,
        root: unref(options.observer.root),
      }
    } as ListenOptions<Type>
  }

  return options as ListenOptions<Type>
}
