import type { TransitionConfig } from 'svelte/transition';
import { linear } from 'svelte/easing';

export function flip(_: HTMLElement, { duration, i }: { duration: number; i: number; }): TransitionConfig {
  console.log(_, duration, i);

  return {
    duration,
    delay: i * 150,
    css: (t) => {
      const eased = linear(t);

      return `scale: ${eased} 1;`;
    }
  };
}
