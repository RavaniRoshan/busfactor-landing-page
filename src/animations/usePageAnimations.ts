import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsap";

/**
 * Page-level choreography for the landing page.
 *
 * All animations live in a single `useGSAP` context scoped to `rootRef`, so
 * selectors never leak past this tree and everything reverts automatically on
 * unmount. A `gsap.matchMedia()` gate means animations are only created when
 * the user has not asked for reduced motion — otherwise nothing is hidden and
 * the page renders fully static and visible.
 *
 * Elements are targeted through `data-anim` hooks, keeping motion in one place
 * while the JSX only carries markers.
 */
export function usePageAnimations(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(rootRef);

        // The docs view shares this React root but has none of the landing
        // page's `data-anim` markers. Without this guard GSAP would warn about
        // dozens of empty targets on every docs render.
        if (q('[data-anim="hero-title"]').length === 0) return;

        /* ---------------------------------------------------------------- */
        /* Reveal helpers                                                    */
        /* ---------------------------------------------------------------- */

        // Reveal each matched element with its own trigger, so a section
        // further down the page animates when IT enters view (not the first).
        const revealEach = (
          selector: string,
          options: { y?: number; start?: string; duration?: number } = {},
        ) => {
          q(selector).forEach((el) => {
            gsap.from(el, {
              scrollTrigger: { trigger: el, start: options.start ?? "top 88%" },
              autoAlpha: 0,
              y: options.y ?? 24,
              duration: options.duration ?? 0.7,
              ease: "power3.out",
            });
          });
        };

        // Reveal a list of items together, staggered, once the list enters.
        const revealList = (
          listSelector: string,
          itemSelector: string,
          options: { y?: number; start?: string; stagger?: number } = {},
        ) => {
          const list = q(listSelector)[0];
          const items = q(itemSelector);
          if (!list || items.length === 0) return;
          gsap.from(items, {
            scrollTrigger: { trigger: list, start: options.start ?? "top 82%" },
            autoAlpha: 0,
            y: options.y ?? 28,
            duration: 0.7,
            stagger: options.stagger ?? 0.08,
            ease: "power3.out",
          });
        };

        /* ---------------------------------------------------------------- */
        /* Load: header and hero                                             */
        /* ---------------------------------------------------------------- */

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q('[data-anim="header"]'), { autoAlpha: 0, y: -12, duration: 0.6 })
          .from(q('[data-anim="hero-eyebrow"]'), { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.3")
          .from(q('[data-anim="hero-title"]'), { autoAlpha: 0, y: 32, duration: 0.9 }, "-=0.35")
          .from(q('[data-anim="hero-body"]'), { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.5")
          .from(
            q('[data-anim="hero-cta"]'),
            { autoAlpha: 0, y: 20, scale: 0.96, duration: 0.7 },
            "-=0.45",
          )
          .from(q('[data-anim="hero-note"]'), { autoAlpha: 0, y: 12, duration: 0.6 }, "-=0.4");

        /* ---------------------------------------------------------------- */
        /* Scroll: section headings                                          */
        /* ---------------------------------------------------------------- */

        revealEach('[data-anim="section-header"]', { y: 24 });

        /* ---------------------------------------------------------------- */
        /* Scroll: grids                                                     */
        /* ---------------------------------------------------------------- */

        revealList('[data-anim="features-grid"]', '[data-anim="feature-card"]', {
          y: 28,
          stagger: 0.12,
        });
        revealList('[data-anim="highlights-grid"]', '[data-anim="highlight-card"]', {
          y: 32,
          stagger: 0.12,
        });
        revealEach('[data-anim="integration-visual"]', { y: 24, start: "top 85%" });
        revealEach('[data-anim="integration-intro"]', { y: 16, start: "top 88%" });
        revealList('[data-anim="integrations-list"]', '[data-anim="integration-card"]');
        revealEach('[data-anim="cli-panel"]', { y: 24, start: "top 85%" });
        revealList('[data-anim="limits-list"]', '[data-anim="limit"]', { stagger: 0.07 });
        revealEach('[data-anim="limits-note"]', { y: 16, start: "top 90%" });
        revealList('[data-anim="faq-list"]', '[data-anim="faq-item"]', { y: 20, stagger: 0.05 });
        revealList('[data-anim="after-scan-list"]', '[data-anim="after-scan-item"]', {
          y: 24,
          stagger: 0.08,
        });

        revealEach('[data-anim="quickstart-panel"]', { y: 24, start: "top 85%" });

        /* ---------------------------------------------------------------- */
        /* Showcase: report window entrance + background parallax            */
        /* ---------------------------------------------------------------- */

        const showcase = q('[data-anim="showcase"]')[0];
        const showcaseBg = q('[data-anim="showcase-bg"]')[0];

        if (showcase) {
          gsap.from(q('[data-anim="report"]'), {
            scrollTrigger: { trigger: showcase, start: "top 78%" },
            autoAlpha: 0,
            y: 48,
            scale: 0.97,
            duration: 1,
            ease: "power3.out",
          });
        }

        if (showcase && showcaseBg) {
          // Pre-scale so the parallax travel never exposes a container edge.
          gsap.set(showcaseBg, { scale: 1.18 });
          gsap.to(showcaseBg, {
            scrollTrigger: {
              trigger: showcase,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
            yPercent: 7,
            ease: "none",
          });
        }

        /* ---------------------------------------------------------------- */
        /* Footer: reveal + background parallax                              */
        /* ---------------------------------------------------------------- */

        const footer = q('[data-anim="footer"]')[0];
        const footerBg = q('[data-anim="footer-bg"]')[0];

        if (footer) {
          revealEach('[data-anim="footer-inner"]', { y: 24, start: "top 85%" });
        }

        if (footer && footerBg) {
          gsap.set(footerBg, { scale: 1.18 });
          gsap.to(footerBg, {
            scrollTrigger: {
              trigger: footer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
            yPercent: -6,
            ease: "none",
          });
        }
      });

      // Invoked by the surrounding gsap.context on revert/unmount.
      return () => mm.revert();
    },
    { scope: rootRef },
  );
}
