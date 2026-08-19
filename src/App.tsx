import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import Catalog from './components/Catalog';
import Kids from './components/Kids';
import Numbers from './components/Numbers';
import WhyUs from './components/WhyUs';
import HowItWorks from './components/HowItWorks';
import Certificate from './components/Certificate';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import FloatStack from './components/FloatStack';
import Privacy from './components/Privacy';
import CookieConsent from './components/CookieConsent';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    document.querySelectorAll('img').forEach((image) => {
      const markAsLoaded = () => image.classList.add('is-loaded');
      if (image.complete) {
        markAsLoaded();
      } else {
        image.addEventListener('load', markAsLoaded, { once: true });
        image.addEventListener('error', markAsLoaded, { once: true });
      }
    });
  }, [loaded, route]);

  return (
    <>
      {route === '#privacidade' ? (
        <Privacy />
      ) : (
        <>
          <Preloader onComplete={() => setLoaded(true)} />
          <Header />
          <main>
            <Hero ready={loaded} />
            <Courses />
            <Catalog />
            <Kids />
            <Numbers />
            <WhyUs />
            <HowItWorks />
            <Certificate />
            <Testimonials />
            <FAQ />
            <CTA />
          </main>
          <FloatStack />
          <Footer />
        </>
      )}
      <CookieConsent />
    </>
  );
}