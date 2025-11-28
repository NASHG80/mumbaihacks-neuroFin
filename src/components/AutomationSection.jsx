import { useEffect, useRef } from 'react';

export default function AutomationSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const listRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const badge = badgeRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const list = listRef.current;
    const card = cardRef.current;
    [badge, heading, para, list, card].forEach(el => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
    });

    const ordered = [badge, heading, para, list, card].filter(Boolean);
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        ordered.forEach((node, idx) => {
          setTimeout(() => {
            node.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, idx * 90);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    io.observe(sectionRef.current);
  }, []);

  return (
    <section id="automation" className="relative" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          <div className="space-y-4 max-w-xl">
            <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5 text-xs text-emerald-100/90">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="iconify text-emerald-300"><path fill="none" d="M12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M22 10v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7zm-4 4h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2m1-10a3 3 0 0 1 3 3v1H2V7a3 3 0 0 1 3-3z"></path></svg>
              <span>UPI‑first automations</span>
            </div>
            <h2 ref={headingRef} className="text-3xl sm:text-4xl font-light tracking-tight">
              <span className="not-italic"><em>Automate</em> bills, rent and EMIs.</span>
            </h2>
            <p ref={paraRef} className="text-base sm:text-lg text-neutral-200/90">
              Never miss a due date again. NueroFin predicts bill cycles, reminds you early and lets you pay in a couple of taps.
            </p>
            <ul ref={listRef} className="space-y-2 text-base sm:text-lg text-neutral-300">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="iconify text-sky-300 mt-1"><path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"></path><path fill="currentColor" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity=".5"></path><path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path></svg>
                <span>Smart calendar for rent, society, electricity, Wi‑Fi and mobile recharges.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="iconify text-emerald-300 mt-1"><path fill="currentColor" d="M7.245 2h9.51c1.159 0 1.738 0 2.206.163a3.05 3.05 0 0 1 1.881 1.936C21 4.581 21 5.177 21 6.37v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V6.37c0-1.193 0-1.79.158-2.27c.3-.913.995-1.629 1.881-1.937C5.507 2 6.086 2 7.245 2"></path><path fill="currentColor" d="M7 6.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 10.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 13.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5z"></path></svg>
                <span>UPI intent &amp; QR shortcuts so you can pay from the app you already trust.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="iconify text-indigo-300 mt-1"><path fill="currentColor" d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7" opacity=".5"></path><path fill="currentColor" d="M7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"></path></svg>
                <span>Quiet alerts tuned to Indian time zones and Do Not Disturb settings.</span>
              </li>
            </ul>
          </div>

          {/* Card mockup */}
          <div className="relative">
            <div className="pointer-events-none absolute -top-6 right-0 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.35),_transparent_60%)] blur-3xl"></div>
            <div className="relative rounded-[1.75rem] border border-white/12 bg-black/80 shadow-[0_30px_90px_rgba(15,23,42,0.9)] overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3 nf-auto-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-neutral-400">Upcoming this week</p>
                    <p className="text-lg font-medium tracking-tight">₹14,980</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5 text-xs text-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="iconify iconify--solar"><path fill="currentColor" opacity=".5" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12s4.477-10 10-10s10 4.477 10 10"></path><path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0"></path></svg>
                    <span>All covered</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-neutral-200">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <div>
                      <p className="text-xs">House Rent • Pune</p>
                      <p className="text-[0.7rem] text-neutral-400">Due 1st of every month</p>
                    </div>
                    <button className="inline-flex items-center gap-1 rounded-full bg-white text-[0.7rem] font-medium text-black px-3 py-1">
                      <span>Pay via UPI</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="iconify iconify--solar"><path fill="currentColor" fillRule="evenodd" d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z" clipRule="evenodd"></path><path fill="currentColor" opacity=".5" d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z"></path></svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <div>
                      <p className="text-xs">Electricity • MSEDCL</p>
                      <p className="text-[0.7rem] text-neutral-400">Auto‑remind 4 days before</p>
                    </div>
                    <span className="text-[0.75rem] text-emerald-300">Reminder set</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <div>
                      <p className="text-xs">SIP • ₹7,500</p>
                      <p className="text-[0.7rem] text-neutral-400">Next on 12th</p>
                    </div>
                    <span className="text-[0.75rem] text-sky-300">On track</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

