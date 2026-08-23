import { useEffect, useRef, useState } from 'react';

/**
 * useOnScreen
 * Tracks whether a ref'd element has entered the viewport, so components
 * can trigger a one-time reveal animation (fade/slide up) instead of a
 * jarring "everything is visible on load" page.
 *
 * @param {Object} options
 * @param {string} [options.rootMargin='0px 0px -10% 0px'] - shrinks the trigger
 *   zone slightly so reveals fire a little before the element is fully in view.
 * @param {number} [options.threshold=0.15] - fraction of the element visible
 *   before it counts as "on screen".
 * @param {boolean} [options.once=true] - if true, stops observing after the
 *   first reveal (elements don't re-hide when scrolled past).
 */
export default function useOnScreen({
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Respect users who've asked for reduced motion: just show content.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, isVisible];
}