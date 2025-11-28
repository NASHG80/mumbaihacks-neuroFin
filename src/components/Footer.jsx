import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const yearSpan = document.getElementById('nf-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const form = document.getElementById('login');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('nf-email');
        if (!email) return;
        const value = email.value.trim();
        if (!value) return;
        form.reset();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = 'Added to list';
          btn.disabled = true;
          btn.classList.add('bg-emerald-500', 'text-white');
          setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
            btn.classList.remove('bg-emerald-500', 'text-white');
          }, 2200);
        }
      });
    }
  }, []);

  return (
    <footer id="nf-footer" className="relative bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          {/* Newsletter */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-neutral-100">NueroFin</p>
            <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              Stay in sync with India’s money OS.
            </h3>
            <p className="text-sm text-neutral-400 max-w-md">
              Get a monthly round‑up of new features, Indian money tactics and behind‑the‑scenes notes from the NueroFin team.
            </p>
            <form id="login" className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center" aria-label="Join NueroFin newsletter">
              <label htmlFor="nf-email" className="sr-only">Email address</label>
              <div className="relative flex-1">
                <input id="nf-email" type="email" required placeholder="you@company.in"
                  className="w-full rounded-full border border-white/15 bg-black/60 px-4 py-2.5 pr-10 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="iconify iconify--solar"><path fill="currentColor" d="M14.2 3H9.8C5.652 3 3.577 3 2.289 4.318S1 7.758 1 12s0 6.364 1.289 7.682S5.652 21 9.8 21h4.4c4.148 0 6.223 0 7.511-1.318S23 16.242 23 12s0-6.364-1.289-7.682S18.348 3 14.2 3" opacity=".5"></path><path fill="currentColor" d="M19.128 8.033a.825.825 0 0 0-1.056-1.268l-2.375 1.98c-1.026.855-1.738 1.447-2.34 1.833c-.582.375-.977.5-1.357.5s-.774-.125-1.357-.5c-.601-.386-1.314-.978-2.34-1.834L5.928 6.765a.825.825 0 0 0-1.056 1.268l2.416 2.014c.975.812 1.765 1.47 2.463 1.92c.726.466 1.434.762 2.25.762c.814 0 1.522-.296 2.249-.763c.697-.448 1.487-1.107 2.462-1.92z"></path></svg>
                </span>
              </div>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black shadow-[0_0_35px_rgba(250,250,250,0.4)] hover:bg-neutral-100 transition-colors">
                <span>Get updates</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="iconify iconify--solar"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5l6 7l-6 7"></path></svg>
              </button>
            </form>
            <p className="text-[0.7rem] text-neutral-500 max-w-sm">
              No spam. One email a month. We don’t sell your data — ever.
            </p>
          </div>

          {/* Footer links */}
          <div className="grid gap-8 sm:grid-cols-3 text-sm">
            <div className="space-y-3">
              <p className="uppercase text-xs font-semibold text-neutral-400 tracking-wide">Service</p>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#spending" className="hover:text-white transition-colors">Spends &amp; Budgets</a></li>
                <li><a href="#automation" className="hover:text-white transition-colors">UPI &amp; Bills</a></li>
                <li><a href="#forecasting" className="hover:text-white transition-colors">Future Planner</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Company</p>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#employers" className="hover:text-white transition-colors">For Employers</a></li>
                <li><a href="#resources" className="hover:text-white transition-colors">Launch Notes</a></li>
                <li><a href="#download" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Trust &amp; Legal</p>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Security &amp; Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Processing</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.72rem] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© <span id="nf-year">2025</span> NueroFin Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@nuerofin.in" className="inline-flex items-center gap-1 hover:text-neutral-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="iconify iconify--solar"><path fill="currentColor" d="M14.2 3H9.8C5.652 3 3.577 3 2.289 4.318S1 7.758 1 12s0 6.364 1.289 7.682S5.652 21 9.8 21h4.4c4.148 0 6.223 0 7.511-1.318S23 16.242 23 12s0-6.364-1.289-7.682S18.348 3 14.2 3" opacity=".5"></path><path fill="currentColor" d="M19.128 8.033a.825.825 0 0 0-1.056-1.268l-2.375 1.98c-1.026.855-1.738 1.447-2.34 1.833c-.582.375-.977.5-1.357.5s-.774-.125-1.357-.5c-.601-.386-1.314-.978-2.34-1.834L5.928 6.765a.825.825 0 0 0-1.056 1.268l2.416 2.014c.975.812 1.765 1.47 2.463 1.92c.726.466 1.434.762 2.25.762c.814 0 1.522-.296 2.249-.763c.697-.448 1.487-1.107 2.462-1.92z"></path></svg>
              <span>hello@nuerofin.in</span>
            </a>
            <a href="#" className="inline-flex items-center gap-1 hover:text-neutral-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="iconify iconify--mdi"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"></path></svg>
              <span>X (Twitter)</span>
            </a>
            <a href="#" className="inline-flex items-center gap-1 hover:text-neutral-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="iconify iconify--mdi"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path></svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

