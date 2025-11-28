import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const blocks = [
  {
    tag: "Shared",
    title: "Shared Family Goals",
    subtitle: "Plan, save and track group goals as a family.",
    bullets: [
      "Multi-person goal tracking",
      "Private & shared modes",
      "Smart visibility controls",
    ],
  },
  {
    tag: "Safety",
    title: "Controlled Access",
    subtitle: "Choose who can see what — and when.",
    bullets: [
      "Role-based visibility",
      "Teen safety modes",
      "Lock sensitive categories",
    ],
  },
  {
    tag: "Insights",
    title: "Household Insights",
    subtitle: "Understand the full picture without micromanaging.",
    bullets: [
      "Combined spend view",
      "Trend detection",
      "Auto-split common expenses",
    ],
  },
  {
    tag: "Sync",
    title: "Family Billing Sync",
    subtitle: "Track everyone’s recurring expenses in one place.",
    bullets: [
      "Subscription grouping",
      "Bill reminders for all members",
      "UPI payments mapped to individuals",
    ],
  },
];

export default function FamilySpaceSection() {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
      gsap.fromTo(descRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.1 });
      gsap.fromTo(cardsRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1, delay: 0.25 });
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative w-full py-24 text-white bg-[#00010D]">
      <div className="absolute inset-0 -z-10 opacity-90"
        style={{ background: "radial-gradient(circle at 15% 20%, rgba(15,24,40,0.9), #00010D 80%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <p className="inline-block text-sm py-1 px-3 rounded-full bg-pink-900/30 border border-pink-700 text-pink-300">
          Family Space · NueroFin
        </p>

        <h2 ref={titleRef} className="mt-6 text-5xl font-light">
          Money management made easy for the whole family.
        </h2>

        <p ref={descRef} className="mt-6 text-lg text-gray-300 max-w-xl">
          Give everyone the right level of control without exposing everything. Simple, safe and flexible.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {blocks.map((b, i) => (
            <article
              key={i}
              ref={el => (cardsRef.current[i] = el)}
              className="p-7 rounded-2xl bg-[#10202F]/80 border border-white/10 backdrop-blur-xl hover:bg-[#182F3F]/95 transition shadow-xl"
            >
              <div className="flex items-start justify-between">
                <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20">{b.tag}</span>
                <span className="text-sm text-pink-300">{b.tag}</span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{b.subtitle}</p>

              <ul className="mt-4 space-y-2 text-gray-300">
                {b.bullets.map((x, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400 mt-1" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-gray-500">
                Designed for Indian households of all sizes.
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
