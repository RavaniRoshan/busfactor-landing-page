import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, before any component creates a ScrollTrigger. `gsap.registerPlugin`
// is idempotent, and importing this module from every animation module guarantees
// registration has run by the time an effect creates a trigger.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
