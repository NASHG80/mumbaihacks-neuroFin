import { useEffect, useRef } from 'react';

export default function ForecastSection() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const img = imgRef.current;
    if (!img) return;
    img.style.opacity = '0';
    img.style.transform = 'translateY(24px)';

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        img.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
        img.style.opacity = '1';
        img.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    io.observe(sectionRef.current);
  }, []);

  return (
    <section id="forecasting" className="relative" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-8">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
              <span className="not-italic"><em>Forecast</em> your next decade in India.</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl">
              Model salary jumps, city moves, kids’ education and parents’ healthcare so you see how your plan bends — before life does.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#forecasting" className="inline-flex items-center gap-2 rounded-full bg-white text-sm font-medium text-black px-4 py-2 shadow-[0_0_40px_rgba(250,250,250,0.45)] hover:bg-neutral-100 transition">
                <span>Explore future planner</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="iconify iconify--solar"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5l6 7l-6 7"></path></svg>
              </a>
              <button className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-2 text-xs font-medium text-indigo-100/90 hover:bg-indigo-400/15 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="iconify iconify--solar"><path fill="currentColor" d="M3.845 3.845a2.883 2.883 0 0 0 0 4.077L5.432 9.51c.012-.014.555.503.568.49l4-4c.013-.013-.504-.556-.49-.568L7.922 3.845a2.883 2.883 0 0 0-4.077 0m1.288 11.462a.483.483 0 0 1 .9 0l.157.4a.48.48 0 0 0 .272.273l.398.157a.486.486 0 0 1 0 .903l-.398.158a.48.48 0 0 0-.272.273l-.157.4a.483.483 0 0 1-.9 0l-.157-.4a.48.48 0 0 0-.272-.273l-.398-.158a.486.486 0 0 1 0-.903l.398-.157a.48.48 0 0 0 .272-.274z" opacity=".5"></path><path fill="currentColor" d="M19.967 9.13a.483.483 0 0 1 .9 0l.156.399c.05.125.148.224.273.273l.398.158a.486.486 0 0 1 0 .902l-.398.158a.5.5 0 0 0-.273.273l-.156.4a.483.483 0 0 1-.9 0l-.157-.4a.5.5 0 0 0-.272-.273l-.398-.158a.486.486 0 0 1 0-.902l.398-.158a.5.5 0 0 0 .272-.273z" opacity=".2"></path><path fill="currentColor" d="M16.1 2.307a.483.483 0 0 1 .9 0l.43 1.095a.48.48 0 0 0 .272.274l1.091.432a.486.486 0 0 1 0 .903l-1.09.432a.5.5 0 0 0-.273.273L17 6.81a.483.483 0 0 1-.9 0l-.43-1.095a.5.5 0 0 0-.273-.273l-1.09-.432a.486.486 0 0 1 0-.903l1.09-.432a.5.5 0 0 0 .273-.274z" opacity=".7"></path><path fill="currentColor" d="M10.568 6.49c-.012.014-.555-.503-.568-.49l-4 4c-.013.013.504.556.49.568l9.588 9.587a2.883 2.883 0 1 0 4.078-4.077z"></path></svg>
                <span>See example family plans</span>
              </button>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="pointer-events-none absolute -top-12 left-1/3 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.35),_transparent_60%)] blur-3xl"></div>
            <div className="overflow-hidden bg-black/80 border-white/12 border rounded-[1.75rem] relative shadow-[0_30px_90px_rgba(15,23,42,0.9)]">
              <div className="backdrop-blur-sm bg-black/40 rounded-[1.4rem] m-3">
                <img
                  ref={imgRef}
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8de8afe6-6def-4dd5-b8cb-264bd4a8eac0_3840w.jpg"
                  alt="Forecast planner"
                  className="nf-forecast-img bg-center w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
