import { useEffect, useState } from 'react';

export function useLeadCapture() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showScrollTrigger, setShowScrollTrigger] = useState(false);
  const [showTimeTrigger, setShowTimeTrigger] = useState(false);

  useEffect(() => {
    const hasSeenLeadCapture = sessionStorage.getItem('sos-lead-capture-seen');
    if (hasSeenLeadCapture) return;

    let scrollTriggered = false;
    let timeTriggered = false;
    const timeTimer = setTimeout(() => {
      timeTriggered = true;
      setShowTimeTrigger(true);
    }, 60000);

    const handleScroll = () => {
      if (scrollTriggered) return;
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        scrollTriggered = true;
        setShowScrollTrigger(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent && !scrollTriggered && !timeTriggered) {
        setShowExitIntent(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeTimer);
    };
  }, [showExitIntent]);

  const markAsSeen = () => {
    sessionStorage.setItem('sos-lead-capture-seen', '1');
  };

  const getActiveTrigger = (): 'exit-intent' | 'scroll' | 'time' | null => {
    if (showExitIntent) return 'exit-intent';
    if (showScrollTrigger) return 'scroll';
    if (showTimeTrigger) return 'time';
    return null;
  };

  return { showExitIntent, showScrollTrigger, showTimeTrigger, markAsSeen, getActiveTrigger };
}