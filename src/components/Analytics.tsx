import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function Analytics() {
  const location = useLocation();
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID;

  useEffect(() => {
    if (!analyticsId) return;

    const isPlausible = analyticsId.startsWith('plausible_');
    const isGA4 = analyticsId.startsWith('G-');

    if (isPlausible) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = 'soscursos.com.br';
      script.src = `https://plausible.io/js/${analyticsId.replace('plausible_', '')}.js`;
      document.head.appendChild(script);
      return () => script.remove();
    }

    if (isGA4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', analyticsId);

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
      document.head.appendChild(script);
      return () => script.remove();
    }
  }, [analyticsId]);

  useEffect(() => {
    if (!analyticsId) return;

    const isPlausible = analyticsId.startsWith('plausible_');
    const isGA4 = analyticsId.startsWith('G-');

    if (isPlausible && window.plausible) {
      window.plausible('pageview');
    }

    if (isGA4 && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location, analyticsId]);

  return null;
}

export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID;
  if (!analyticsId) return;

  const isPlausible = analyticsId.startsWith('plausible_');
  const isGA4 = analyticsId.startsWith('G-');

  if (isPlausible && window.plausible) {
    window.plausible(eventName, { props });
  }

  if (isGA4 && window.gtag) {
    window.gtag('event', eventName, props);
  }
}