import { useEffect, useRef } from 'react';

export default function FamiliesSection() {
  const sectionRef = useRef(null);
  const mainImgRef = useRef(null);
  const illRef = useRef(null); // if there was an illustration, not used here

  useEffect(() => {
    if (!sectionRef.current) return;
    const mainImg = mainImgRef.current;
    const ill = illRef.current;
    [ill, mainImg].forEach(el => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        [ill, mainImg].forEach((el, idx) => {
          if (!el) return;
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, idx * 130);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    io.observe(sectionRef.current);
  }, []);

  return (
    <section id="families" className="relative" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
              <span className="not-italic"><em>Manage</em> money as a family.</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-300">
              Add your spouse, siblings or parents at no extra cost. Share what you want, keep what you don’t — with goal‑level visibility controls.
            </p>
          </div>
          <div className="relative w-full">
            <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.3),_transparent_60%)] blur-3xl"></div>
            <div className="relative mx-auto max-w-4xl">
              <img
                ref={mainImgRef}
                src="/Screenshot 2025-11-29 075817.png"
                alt="Family globe"
                className="nf-family-main bg-center bg-black/70 w-full h-auto object-cover border-white/12 border rounded-[2rem] shadow-[0_30px_110px_rgba(15,23,42,0.95)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
