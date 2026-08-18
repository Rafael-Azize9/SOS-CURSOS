import { useEffect } from 'react';

export function useSpotlight(
  containerRef: React.RefObject<HTMLElement | null>,
  dependencies: unknown[] = []
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = container.querySelectorAll<HTMLElement>('.course-card, .benefit-card');
    const handlers: Array<[HTMLElement, (event: Event) => void]> = [];

    cards.forEach((card) => {
      if (card.classList.contains('card-spotlight')) return;
      card.classList.add('card-spotlight');
      const onMove = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${mouseEvent.clientX - rect.left}px`);
        card.style.setProperty('--my', `${mouseEvent.clientY - rect.top}px`);
      };
      card.addEventListener('mousemove', onMove);
      handlers.push([card, onMove]);
    });

    return () => {
      handlers.forEach(([card, onMove]) => card.removeEventListener('mousemove', onMove));
      cards.forEach((card) => card.classList.remove('card-spotlight'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}