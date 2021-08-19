import type { WatchSource } from 'vue'
import { scheduleBind } from '../extracted'
import type { BindTarget, BindValue } from '../extracted'

export function bindStyle ({ element, property, value, watchSources }: {
  element: BindTarget,
  property: string,
  value: BindValue<string>,
  watchSources: WatchSource | WatchSource[]
}) {
  scheduleBind<string>(
    {
      element,
      effect: ({ element, value }) => {
        if ((element as HTMLElement).style[property] === value) {
          return
        }
        
        (element as HTMLElement).style[property] = value
      },
      value,
      watchSources,
    }
  )
}


SVGElement
