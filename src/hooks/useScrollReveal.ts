import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

export function useScrollReveal(
  ref: React.RefObject<HTMLElement | null>,
  dependencies: unknown[] = []
) {
  const revealed = useRef(new WeakSet<Element>());

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const items = gsap.utils.toArray<Element>('[data-reveal]', scope);
      if (!items.length) return;

      const fresh = items.filter((el) => !revealed.current.has(el));
      if (!fresh.length) return;

      const mm = gsap.matchMedia(scope);

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(fresh, { clearProps: 'all' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(fresh, { autoAlpha: 0, y: 26, scale: 0.985 });

        ScrollTrigger.batch(fresh, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => revealed.current.add(el));
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.09,
              overwrite: true,
            });
          },
        });
      });
    },
    { scope: ref, dependencies }
  );
}