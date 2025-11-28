import { useEffect, useRef } from 'react';

export default function AISearchSection() {
  const sectionRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const textRefs = useRef([]);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const blobs = [blob1Ref.current, blob2Ref.current];
    const texts = Array.from(sectionRef.current.querySelectorAll('.nf-ai-animate'));
    const card = cardRef.current;
    [...blobs, ...texts, card].forEach(el => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });

    const sequence = [...texts, card, ...blobs].filter(Boolean);
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sequence.forEach((node, idx) => {
          setTimeout(() => {
            node.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, idx * 80);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    io.observe(sectionRef.current);
  }, []);

  return (
    <section id="ai-search" className="relative" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/10 via-black to-sky-500/10">
          <div ref={blob1Ref} className="absolute -top-40 -right-40 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.35),_transparent_60%)] blur-3xl"></div>
          <div ref={blob2Ref} className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.3),_transparent_60%)] blur-3xl"></div>
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] items-center px-6 py-10 sm:px-10 sm:py-12">
            <div className="space-y-4 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-400/30 px-3 py-1.5 text-xs text-indigo-100/90 nf-ai-animate">
                <span className="iconify" data-icon="solar:brain-circuit-bold-duotone" data-width="16" data-height="16"></span>
                <span>NueroFin AI Advisor</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight nf-ai-animate">
                <span className="text-white/90"><em className="not-italic">Ask</em> anything</span> about your Indian money.
              </h2>
              <p className="text-base sm:text-lg text-neutral-200/90 nf-ai-animate">
                NueroFin blends your live data, Indian tax rules and goal plans so answers aren’t just plausible — they’re personal and actionable.
              </p>
            </div>

            {/* AI Chat Mock */}
            <div ref={cardRef} className="relative nf-ai-card rounded-3xl border border-white/8 bg-black/70 shadow-[0_30px_80px_rgba(15,23,42,0.9)] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                  <span className="iconify" data-icon="mingcute:robot-2-fill" data-width="18" data-height="18"></span>
                </div>
                <div className="text-xs text-neutral-300">
                  <div className="font-medium text-neutral-100 text-[0.78rem]">Neha • NueroFin</div>
                  <div className="text-[0.68rem] text-emerald-300 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="iconify text-emerald-300"><path fill="none" d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" opacity=".5"></path><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"></path></svg>
                    India‑focused guidance engine
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/5 px-3 py-2 text-[0.78rem] text-neutral-100 max-w-xs ml-auto">
                  Can I save for a ₹12L home down payment in 6 years with my current salary in Hyderabad?
                </div>
                <div className="rounded-2xl bg-sky-500/10 border border-sky-400/30 px-3 py-2 text-[0.78rem] text-neutral-100 max-w-sm">
                  Yes — if you increase your savings rate from 17% to 22% and move idle ₹3,800/month from wallet balance into targeted equity SIPs. <span className="text-sky-200">I’ve built a 6‑year plan with 7.2% inflation and modest salary jumps: you reach ~₹12.6L by year 6.</span>
                </div>
                <div className="rounded-2xl bg-white/5 px-3 py-2 text-[0.78rem] text-neutral-100 max-w-xs ml-auto">
                  What if rent rises by ₹5,000 next year?
                </div>
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/30 px-3 py-2 text-[0.78rem] text-neutral-100 max-w-sm">
                  Your free cash flow drops by ~10%. If you delay the home goal by 6 months and trim two lifestyle categories, you keep your emergency fund and SIPs intact.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
