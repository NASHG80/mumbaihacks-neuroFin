import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const features = [
  {
    tag: "Goals",
    title: "Smart Long-Term Goals",
    subtitle: "Plan travel, savings, EMIs or upgrades without guesswork.",
    bullets: [
      "Goal realism calculator",
      "Auto-adjusting timelines",
      "Progress forecasting",
    ],
  },
  {
    tag: "AI",
    title: "Predictive Planning",
    subtitle: "Understands your patterns and predicts upcoming expenses.",
    bullets: [
      "Month-end predictions",
      "Seasonal expense mapping",
      "Income pattern learning",
    ],
  },
  {
    tag: "Invest",
    title: "Investment Support",
    subtitle: "Helps you decide safe monthly allocations.",
    bullets: [
      "SIP suggestion engine",
      "Risk score insights",
      "Balanced saving distribution",
    ],
  },
  {
    tag: "Calendar",
    title: "Event-Aware Spending",
    subtitle: "Planner syncs with your life — not the other way around.",
    bullets: [
      "Auto-detect birthdays/trips",
      "Forecast event expenses",
      "Reminders for high-spend weeks",
    ],
  },
];

export default function FuturePlannerSection() {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
      gsap.fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.12 });
      gsap.fromTo(cardsRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 1, delay: 0.25 });
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative py-24 text-white bg-[#00010D]">
      <div className="absolute inset-0 -z-10 opacity-90"
        style={{ background: "radial-gradient(circle at 18% 20%, rgba(10,22,40,0.9), #00010D 75%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <p className="inline-block text-sm py-1 px-3 rounded-full bg-indigo-900/40 border border-indigo-700 text-indigo-300">
          Future Planner · NueroFin
        </p>

        <h2 ref={titleRef} className="mt-6 text-5xl font-light">
          A planner that thinks ahead for you.
        </h2>

        <p ref={descRef} className="mt-6 text-lg text-gray-300 max-w-xl">
          Plan better without spreadsheets. NueroFin learns your habits and helps you prepare for every milestone.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <article
              key={i}
              ref={el => (cardsRef.current[i] = el)}
              className="p-7 rounded-2xl bg-[#10202F]/80 border border-white/10 backdrop-blur-xl hover:bg-[#162A3C]/95 transition shadow-xl"
            >
              <div className="flex items-start justify-between">
                <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20">{f.tag}</span>
                <span className="text-sm text-indigo-300">{f.tag}</span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{f.subtitle}</p>

              <ul className="mt-4 space-y-2 text-gray-300">
                {f.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-gray-500">Always adjusting to your life.</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
