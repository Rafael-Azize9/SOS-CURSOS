import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete = () => {} }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('is-loading');

    const done = () => {
      if (finished.current) return;
      finished.current = true;
      onComplete();
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        scale: 1.02,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => {
          root.classList.remove('is-loading');
          setRemoved(true);
        },
      });
    };

    const minDelay = window.setTimeout(() => {
      if (document.readyState === 'complete') {
        done();
      } else {
        window.addEventListener('load', done, { once: true });
      }
    }, 320);

    return () => {
      window.clearTimeout(minDelay);
      window.removeEventListener('load', done);
      root.classList.remove('is-loading');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (removed) return null;

  return (
    <div id="preloader" ref={rootRef} role="status" aria-live="polite">
      <div className="preloader-mark">
        <span className="preloader-badge">SOS</span>
        <span className="preloader-ring" aria-hidden="true"></span>
        <span className="preloader-word">S.O.S Cursos</span>
      </div>
      <span className="sr-only">Carregando o site...</span>
    </div>
  );
}