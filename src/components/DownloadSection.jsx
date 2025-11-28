import { useEffect, useRef } from 'react';

export default function DownloadSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const bg = bgRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    [bg, left, right].forEach(el => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(35px)';
    });

    const sequence = [bg, left, right].filter(Boolean);
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sequence.forEach((node, idx) => {
          setTimeout(() => {
            node.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, idx * 120);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    io.observe(sectionRef.current);
  }, []);

  return (
    <section id="download" className="relative" ref={sectionRef}>
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
          alt="footer hero"
          className="h-full w-full object-cover opacity-70"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70"></div>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center">
          <div ref={leftRef} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-emerald-100">
              <span className="iconify" data-icon="solar:discount-bold-duotone" data-width="16" data-height="16"></span>
              <span>₹899 for 12 months — founding India cohort pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              <span className="not-italic"><em>Get</em> NueroFin before public launch.</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-200 max-w-md">
              Join over 42,000 early Indian users building a calmer, more intentional relationship with money.
            </p>
            <a href="#signup" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black shadow-[0_0_45px_rgba(250,250,250,0.45)] hover:bg-neutral-100">
              <span>Join the waitlist</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="iconify iconify--solar"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5l6 7l-6 7"></path></svg>
            </a>
            <div className="pt-2">
              <p className="text-[0.7rem] text-neutral-400 max-w-sm">
                Featured by leading Indian personal finance newsletters and communities — mentions are not investment advice.
              </p>
            </div>
          </div>
          <div ref={rightRef} className="relative">
            <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.5),_transparent_60%)] blur-3xl"></div>
            <div className="relative mx-auto w-full max-w-sm">
              <img
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0465d628-a834-480c-8e14-ff665ed9a84b_800w.jpg"
                alt="NueroFin app"
                className="bg-black/70 w-full h-auto object-cover bg-center border-white/15 border rounded-[2rem] shadow-[0_40px_130px_rgba(15,23,42,0.95)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
