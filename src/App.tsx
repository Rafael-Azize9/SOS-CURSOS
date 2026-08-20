import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatStack from './components/FloatStack';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import Analytics from './components/Analytics';
import LeadCapture from './components/LeadCapture';
import { useLeadCapture } from './hooks/useLeadCapture';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.default })));
const Catalog = lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.default })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.default })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.default })));
const Wheel = lazy(() => import('./components/Wheel').then(m => ({ default: m.default })));
const Privacy = lazy(() => import('./components/Privacy').then(m => ({ default: m.default })));

function LoadingFallback() {
  return (
    <div className="loading-fallback" role="status" aria-label="Carregando página">
      <div className="spinner" />
      <span>Carregando...</span>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<div className="error-fallback">Erro ao carregar painel administrativo</div>}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<div className="error-fallback">Erro ao carregar página</div>}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  const { showExitIntent, showScrollTrigger, showTimeTrigger, markAsSeen, getActiveTrigger } = useLeadCapture();
  const [activeTrigger, setActiveTrigger] = useState<'exit-intent' | 'scroll' | 'time' | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const markImage = (image: HTMLImageElement) => {
      const markAsLoaded = () => image.classList.add('is-loaded');
      if (image.complete) {
        markAsLoaded();
      } else {
        image.addEventListener('load', markAsLoaded, { once: true });
        image.addEventListener('error', markAsLoaded, { once: true });
      }
    };

    const markAllImages = () => document.querySelectorAll('img').forEach(markImage);
    markAllImages();

    const observer = new MutationObserver(markAllImages);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const trigger = getActiveTrigger();
    if (trigger && !activeTrigger) {
      setActiveTrigger(trigger);
    }
  }, [showExitIntent, showScrollTrigger, showTimeTrigger, getActiveTrigger, activeTrigger]);

  const handleLeadClose = () => {
    markAsSeen();
    setActiveTrigger(null);
  };

  return (
    <>
      <Preloader />
      <SEO />
      <Analytics />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/catalogo" element={<PublicRoute><Catalog /></PublicRoute>} />
          <Route path="/planos" element={<PublicRoute><Catalog /></PublicRoute>} />
          <Route path="/curso/:slug" element={<PublicRoute><CourseDetail /></PublicRoute>} />
          <Route path="/roleta" element={<PublicRoute><Wheel /></PublicRoute>} />
          <Route path="/privacidade" element={<PublicRoute><Privacy /></PublicRoute>} />
          <Route path="/painel-sos" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FloatStack />
      <Footer />
      {activeTrigger && (
        <LeadCapture
          isOpen={true}
          onClose={handleLeadClose}
          trigger={activeTrigger}
        />
      )}
    </>
  );
}