import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const blocks = [
  {
    tag: "UPI",
    title: "Instant UPI Sync",
    subtitle: "Every UPI transaction categorized and reconciled instantly.",
    bullets: [
      "Real-time UPI payment tracking",
      "Detects merchant patterns",
      "Auto-tags transfers vs purchases",
    ],
  },
  {
    tag: "Bills",
    title: "Automatic Bill Recognition",
    subtitle:
      "Bills auto-detected from SMS, email, and transaction patterns.",
    bullets: [
      "Smart subscription detection",
      "Due date predictions",
      "One-tap bill reminders",
    ],
  },
  {
    tag: "Protection",
    title: "Fraud & Spike Detection",
    subtitle:
      "Alerts you when amounts look unusual or risky.",
    bullets: [
      "Catches suspicious payments",
      "Notifies about duplicate charges",
      "SMS-alert level monitoring",
    ],
  },
  {
    tag: "Smart",
    title: "UPI Intent Intelligence",
    subtitle:
      "Understands payment purpose and groups them automatically.",
    bullets: [
      "Auto-group rent, fees, groceries",
      "Learns from your habits",
      "Accurate monthly bill reports",
    ],
  },
];

export default function UPIBillsSection() {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
      gsap.fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.12 });

      gsap.fromTo(cardsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 1, delay: 0.25 }
      );

      gsap.fromTo(bottomRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.7 }
      );
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative w-full py-24 text-white bg-[#00010D]">
      {/* Gradient */}
      <div className="absolute inset-0 -z-10 opacity-90"
        style={{background: "radial-gradient(circle at 20% 25%, rgba(10,26,47,0.9) 0%, rgba(0,1,13,0.95) 70%)"}}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <p className="inline-block text-sm py-1 px-3 rounded-full bg-emerald-900/30 border border-emerald-700 text-emerald-300">
          UPI & Bills · NueroFin
        </p>

        <h2 ref={titleRef} className="mt-6 text-5xl font-light">
          UPI clarity without the clutter.
        </h2>

        <p ref={descRef} className="mt-6 text-lg text-gray-300 max-w-xl">
          Every payment tracked, every bill recognized, and every risk flagged before it becomes a problem.
        </p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
          {blocks.map((b, i) => (
            <article
              key={i}
              ref={el => (cardsRef.current[i] = el)}
              className="p-7 rounded-2xl bg-[#0F212B]/80 border border-white/8 backdrop-blur-lg hover:bg-[#163041]/90 transition shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20">{b.tag}</span>
                <span className="text-sm text-emerald-300">{b.tag}</span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{b.subtitle}</p>

              <ul className="mt-4 space-y-2 text-gray-300">
                {b.bullets.map((x, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-gray-500">Updated instantly with every UPI event.</p>
            </article>
          ))}
        </div>

        <div ref={bottomRef} className="mt-16 text-sm text-gray-500">
          SMS, email and app activity work together to give a complete UPI timeline.
        </div>

      </div>
    </section>
  );
}
