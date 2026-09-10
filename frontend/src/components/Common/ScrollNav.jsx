import React, { useEffect, useState } from 'react';

export default function ScrollNav() {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setAtTop(scrollY < 10);
      setAtBottom(scrollY + viewportHeight >= fullHeight - 10);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        disabled={atTop}
        aria-label="Scroll to top"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rt-orange-500 hover:bg-rt-orange-600 disabled:bg-rt-surfacealt disabled:text-rt-muted/50 disabled:cursor-not-allowed text-black flex items-center justify-center shadow-panel transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <button
        onClick={scrollToBottom}
        disabled={atBottom}
        aria-label="Scroll to bottom"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rt-orange-500 hover:bg-rt-orange-600 disabled:bg-rt-surfacealt disabled:text-rt-muted/50 disabled:cursor-not-allowed text-black flex items-center justify-center shadow-panel transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}