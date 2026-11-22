import { useEffect, useRef, type ReactNode } from "react";
import { track, type MarketingEvent } from "../lib/analytics";

interface ViewTrackerProps {
  event: MarketingEvent;
  children?: ReactNode;
}

export function ViewTracker({ event, children }: ViewTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || fired.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          fired.current = true;
          track(event);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [event]);

  return <div ref={ref}>{children}</div>;
}
