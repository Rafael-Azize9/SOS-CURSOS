import { useEffect, useRef } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { wa, WA_MESSAGE_DEFAULT } from '../data';

export default function FloatStack() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const waFloat = root.querySelector('.wa-float');
    const backTop = root.querySelector('.back-top');

    const onScroll = () => {
      if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > 480);
      if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 900);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    if (backTop) backTop.addEventListener('click', goTop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (backTop) backTop.removeEventListener('click', goTop);
    };
  }, []);

  return (
    <div className="float-stack" ref={rootRef}>
      <a
        className="wa-float"
        href={wa(WA_MESSAGE_DEFAULT)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle strokeWidth={2} />
      </a>
      <button className="back-top" type="button" aria-label="Voltar ao topo">
        <ArrowUp strokeWidth={2.2} />
      </button>
    </div>
  );
}