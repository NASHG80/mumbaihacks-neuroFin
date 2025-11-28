import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default function Hero() {
  const heroRef = useRef(null);
  const typingRef = useRef(null);
  const scoreRef = useRef(null);

  // Typing suggestions (Typing: A)
  const suggestions = [
    '“Mera rent, SIP aur UPI spends ek saath kaise plan karun?”',
    '“If I save ₹30k/month, 18 lakh ka goal kab tak achieve hoga?”',
    '“Parents ke medical fund ke saath Goa trip bhi fit ho sakta hai?”',
  ];

  useEffect(() => {
    // =========================
    // GSAP FADE + SLIDE REVEAL
    // =========================
    const revealEls = heroRef.current.querySelectorAll(".nf-hero-animate");
    gsap.set(revealEls, { opacity: 0, y: 22 });

    gsap.to(revealEls, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    // =========================
    // GSAP TYPING ANIMATION
    // =========================
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

    suggestions.forEach((text) => {
      tl.to(typingRef.current, {
        duration: text.length * 0.04,
        text,
        ease: "none",
      })
        .to({}, { duration: 0.9 })
        .to(typingRef.current, {
          duration: text.length * 0.03,
          text: "",
          ease: "none",
        });
    });

    // =========================
    // SCORE COUNTER ANIMATION
    // =========================
    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: 9.2,
      duration: 1.7,
      delay: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) {
          scoreRef.current.textContent = scoreObj.val.toFixed(1);
        }
      },
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(revealEls);
    };
  }, []);

  return (
    <section
      id="nf-hero"
      ref={heroRef}
      className="relative overflow-hidden bg-[#05050A] text-white"
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.16),transparent_60%)] blur-[180px]" />
        <div className="absolute right-0 bottom-0 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.9),transparent_60%)] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* Badge */}
            <div className="nf-hero-animate inline-flex items-center gap-3 rounded-full border border-emerald-300/18 bg-emerald-400/6 px-4 py-2 text-xs font-medium tracking-wide text-emerald-100 shadow-[0_0_60px_rgba(16,185,129,0.14)]">
              <span>Founding India cohort – first year at ₹899</span>
            </div>

            {/* Heading */}
            <h1 className="nf-hero-animate text-[3.6rem] leading-[1.0] font-light tracking-tight max-w-2xl">
              Compose your Indian money <span className="block">OS.</span>
            </h1>

            {/* Subtext */}
            <p className="nf-hero-animate text-lg text-neutral-300 max-w-xl">
              NueroFin is your personal AI Money Copilot for India.  
              Connect UPI handles, cards, bank accounts and goals into one live workspace —  
              then ask NueroFin what to do next.
            </p>

            {/* CTA Buttons */}
            <div className="nf-hero-animate flex items-center gap-4 mt-2">
              <a className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_30px_120px_rgba(255,255,255,0.08)] hover:bg-neutral-100 transition">
                START WITH ₹0 joining fee
              </a>
              <a className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/6 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/8 transition">
                ₹899 only (Founding)
              </a>
            </div>

            {/* Typing pill with GSAP typing */}
            <div className="nf-hero-animate mt-8 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-full bg-white/5 border border-white/6 px-4 py-3 text-sm text-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                  <span ref={typingRef} className="select-none"></span>
                  <span aria-hidden className="inline-block ml-1 text-neutral-400">|</span>
                </div>
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/6 border border-white/6">
                  <div className="h-6 w-6 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            {/* Lower Subtext */}
            <div className="nf-hero-animate mt-6 text-base text-neutral-300/80 max-w-xl">
              Track everything. Ask in Hinglish. Automate the next move.
            </div>
          </div>

          {/* RIGHT SIDE — Image + Score + Insight */}
          <div className="relative nf-hero-animate">
            <div className="rounded-3xl overflow-hidden bg-neutral-900/20 border border-white/6 shadow-[0_40px_140px_rgba(2,6,23,0.9)]">

              {/* ORIGINAL PHOTO — unchanged */}
              <img
                src="https://images.pexels.com/photos/6927447/pexels-photo-6927447.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="NueroFin dashboard"
                className="w-full h-[520px] object-cover rounded-3xl"
                loading="lazy"
              />

              {/* Score + insight overlay */}
              <div className="absolute left-6 bottom-6 max-w-[68%]">

                <div className="text-xs text-neutral-300">Nuero Score</div>

                <div className="flex items-end gap-3">
                  <div ref={scoreRef} className="text-4xl font-semibold text-white">0.0</div>
                  <div className="text-sm text-emerald-300/90 mt-1">/ 10</div>
                </div>

                <div className="mt-2 text-xs text-emerald-300/80">
                  ↑ Ahead of 84% of similar Indian households
                </div>

                {/* Insight box */}
                <div className="mt-4 rounded-xl bg-black/70 border border-white/6 px-4 py-3 text-sm text-neutral-200 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                  <div className="flex items-start gap-3">
                    <div className="flex-none h-8 w-8 rounded-full bg-emerald-700/80 flex items-center justify-center text-white text-sm">i</div>
                    <div>
                      <div className="font-medium">Today's insight</div>
                      <div className="text-sm text-neutral-300 mt-1">
                        You can redirect ₹4,200/month from low-value spends to SIPs and still keep your lifestyle unchanged.
                      </div>
                    </div>
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
