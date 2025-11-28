import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const notes = [
  {
    tag: "v1.0.0",
    title: "Founding Release — India Cohort",
    date: "Nov 25, 2025",
    highlights: [
      "Live UPI & bank sync",
      "AI-driven budgets tuned to Indian cities",
      "Bill automation with UPI intent",
    ],
    tone: "Celebratory",
  },
  {
    tag: "v1.1.0",
    title: "Smarter Insights & Score",
    date: "Dec 18, 2025",
    highlights: [
      "NueroScore: personalized financial health",
      "Actionable nudges for SIPs & savings",
      "Hinglish conversational support",
    ],
    tone: "Product",
  },
  {
    tag: "v1.2.0",
    title: "Family & Goals",
    date: "Jan 12, 2026",
    highlights: [
      "Shared family goals",
      "Visibility controls per-goal",
      "Tax-aware reminders (beta)",
    ],
    tone: "Family",
  },
];

export default function LaunchNotesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.15,
            ease: "power3.out",
          }
        );
      }

      if (cardsRef.current && cardsRef.current.length) {
        gsap.fromTo(
          cardsRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 text-white bg-[#00010D] overflow-visible"
    >
      {/* background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#0A1A2F_0%,#00010D_70%)] opacity-90" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <p className="inline-block text-sm py-1 px-3 rounded-full bg-emerald-900/40 border border-emerald-700 text-emerald-300 font-medium tracking-wide">
          Launch Notes · NueroFin
        </p>

        <h2
          ref={titleRef}
          className="mt-6 text-5xl lg:text-6xl font-light leading-tight"
        >
          What just launched — and what’s next.
        </h2>

        <p
          ref={descRef}
          className="mt-6 text-lg text-gray-300 max-w-xl"
        >
          Release notes crafted with intent — sharp summaries, Indian-first
          context, and clear next steps for your money OS.
        </p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10" >
          {notes.map((n, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="
                p-7 rounded-2xl
                bg-[#10202F]/80 
                border border-white/10 
                backdrop-blur-xl 
                shadow-xl 
                hover:shadow-emerald-600/20 
                hover:bg-[#162A3C]/95
                transition-all duration-300
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20">
                      {n.tag}
                    </span>
                    <h3 className="text-2xl font-semibold">{n.title}</h3>
                  </div>

                  <p className="mt-1 text-sm text-gray-400">{n.date}</p>
                </div>

                <div className="text-sm text-emerald-300 font-medium">
                  {n.tone}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-gray-300">
                {n.highlights.map((h, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-gray-500">
                Tip: “Read details” reveals deep context & next steps.
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 flex items-center gap-6 opacity-70">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />
          <span className="text-sm text-gray-500">
            {notes.length} public releases · 12 internal patches
          </span>
        </div>
      </div>
    </section>
  );
}