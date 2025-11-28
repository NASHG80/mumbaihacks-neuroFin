import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const features = [
  {
    tag: "Controls",
    title: "Smart Spend Limits",
    subtitle:
      "Budgets that auto-adapt to behavior, goals and real-time spending trends.",
    bullets: [
      "Daily / weekly caps with auto-reset",
      "Auto-block overspends & suspicious spikes",
      "Context-aware nudges before you overshoot",
    ],
  },
  {
    tag: "AI Insights",
    title: "AI-Powered Spend Analysis",
    subtitle:
      "NueroOS learns your patterns and forecasts future expenses proactively.",
    bullets: [
      "Category-level breakdowns",
      "Projected month-end balance",
      "Personalized saving suggestions",
    ],
  },
  {
    tag: "Bills",
    title: "Automated Bill Intelligence",
    subtitle:
      "Bills recognized instantly — categorized, scheduled and protected by smart reminders.",
    bullets: [
      "UPI bill pay tracking",
      "Auto-detect subscription renewals",
      "Late-fee prevention alerts",
    ],
  },
  {
    tag: "Goals",
    title: "Goals & Envelope Planning",
    subtitle:
      "Create smart envelopes for rent, travel, EMIs or investments — then let NueroFin automate the math.",
    bullets: [
      "Auto-transfer rules",
      "Joint goals with family",
      "Realistic savings windows",
    ],
  },
];

export default function SpendsBudgetsSection() {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        descRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.12, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        cardsRef.current,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          delay: 0.25,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        bottomRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.7, duration: 0.8, ease: "power2.out" }
      );
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative w-full py-24 text-white bg-[#00010D] overflow-visible"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 20% 25%, rgba(10,26,47,0.9) 0%, rgba(0,1,13,0.95) 70%)",
        }}
      />

      {/* Light texture */}
      <div
        className="absolute inset-0 -z-10 mix-blend-screen opacity-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/mnt/data/4d8575d4-d11a-4cb0-b99f-be810f6884dc.png')",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="inline-block text-sm py-1 px-3 rounded-full bg-emerald-900/30 border border-emerald-700 text-emerald-300 font-medium tracking-wide">
            Spends & Budgets · NueroFin
          </p>

          <h2
            ref={titleRef}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-light leading-tight"
          >
            Finally, a money system that feels one step ahead of you.
          </h2>

          <p ref={descRef} className="mt-6 text-lg text-gray-300 max-w-xl">
            Real-time tracking, intelligent limits, automated bill handling and
            predictive budgeting — everything that makes managing money feel
            effortless.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <article
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="relative p-7 rounded-2xl bg-[#0F212B]/80 border border-white/8 backdrop-blur-lg shadow-lg hover:shadow-emerald-600/10 hover:bg-[#133042]/90 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20">
                      {f.tag}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-semibold">
                      {f.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{f.subtitle}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-gray-300">
                {f.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-gray-500">
                Updated in real-time — always accurate.
              </p>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <div
          ref={bottomRef}
          className="mt-20 text-sm text-gray-500 max-w-2xl"
        >
          Budgets recompute continuously based on live spend, upcoming bills and
          historical patterns. No manual tracking. No end-of-month surprises.
        </div>
      </div>
    </section>
  );
}
