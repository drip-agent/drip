import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Register GSAP plugins. Call once at app init.
 */
export function registerGSAP() {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Default ScrollTrigger config for reveal animations.
 * Start when element top hits 85% of viewport,
 * end when element bottom hits 15%.
 */
export const defaultScrollTrigger: ScrollTrigger.Vars = {
  start: "top 85%",
  end: "bottom 15%",
  toggleActions: "play none none none",
};

/**
 * Easing presets used across the animation system.
 */
export const easings = {
  smooth: "power2.out",
  snap: "power3.out",
  bounce: "back.out(1.4)",
} as const;

/**
 * Reduced-motion wrapper using gsap.matchMedia().
 * Runs `normalFn` by default. When `prefers-reduced-motion: reduce`
 * matches, runs `reducedFn` (or no-op if omitted).
 *
 * Returns the matchMedia instance for cleanup.
 */
export function withReducedMotion(
  normalFn: () => void,
  reducedFn?: () => void
): gsap.MatchMedia {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    normalFn();
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    if (reducedFn) reducedFn();
  });

  return mm;
}
