import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsap";

/**
 * Component-scoped GSAP setup that respects `prefers-reduced-motion`.
 *
 * Runs `setup` inside a `useGSAP` context scoped to `scope`, but only while the
 * user has not asked for reduced motion — in that case nothing is created, so
 * the component stays in its natural, fully visible state. The `matchMedia`
 * listener and every animation are reverted on unmount.
 *
 * Pass `dependencies` for animations that must re-run when a value changes
 * (e.g. a tab/view switch); those are reverted before re-running so tweens
 * never pile up on the same target.
 */
export function useMotionGsap(
  setup: () => void,
  scope: RefObject<HTMLElement | null>,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", setup);
      // Called by the surrounding gsap.context on revert/unmount.
      return () => mm.revert();
    },
    {
      scope,
      dependencies,
      // Revert before re-running when dependencies change, so a view switch
      // never stacks a new tween on top of the previous one.
      revertOnUpdate: dependencies.length > 0,
    },
  );
}
