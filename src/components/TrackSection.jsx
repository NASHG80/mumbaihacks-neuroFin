"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrackSection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const glowRef = useRef(null);
  const shimmerRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* -----------------------------------
         HEADING ANIMATION .
      ----------------------------------- */
      gsap.from(".track-title", {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".track-desc", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      /* -----------------------------------
         CARDS FADE-UP + SCALE POP
      ----------------------------------- */
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      /* -----------------------------------
         FLOATING ANIMATION (PREMIUM)
      ----------------------------------- */
      cardRefs.current.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : -14,
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* -----------------------------------
         SHIMMER ANIMATION
      ----------------------------------- */
      shimmerRefs.current.forEach((shim, i) => {
        gsap.to(shim, {
          xPercent: 160,
          duration: 3,
          repeat: -1,
          delay: i * 0.4,
          ease: "power2.inOut",
        });
      });

      /* -----------------------------------
         GLOW PULSING
      ----------------------------------- */
      gsap.to(glowRef.current, {
        opacity: 0.35,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* -----------------------------------
         3D TILT ON HOVER
      ----------------------------------- */
      cardRefs.current.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            rotateY: x / 35,
            rotateX: -y / 35,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Utility for refs */
  const cardRefSetter = (el, i) => (cardRefs.current[i] = el);
  const shimRefSetter = (el, i) => (shimmerRefs.current[i] = el);

  /* -------------------------------------------
     JSX
  ------------------------------------------- */

  return (
    <section id="nf-track" className="relative py-24" ref={sectionRef}>
      {/* Ambient Glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 -z-10 mx-auto w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(120,0,255,0.4),transparent_70%)] blur-[150px] opacity-20"
      />

      {/* TEXT */}
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="track-title text-4xl sm:text-5xl lg:text-6xl font-light text-white">
          Track every spend, bill
          <br /> and balance.
        </h2>

        <p className="track-desc text-neutral-300 max-w-3xl mx-auto mt-5 text-lg">
          One live stream for all of your Indian money. NueroFin combines card
          swipes, UPI, cash withdrawals and EMI debits so you can zoom from one
          coffee to your full month burn in seconds.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="mx-auto max-w-6xl px-6 mt-20 grid gap-6 md:grid-cols-2">
        {/* Spending Card */}
        <article
          ref={(el) => cardRefSetter(el, 0)}
          className="nf-card relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        >
          <div className="relative">
            {/* SHIMMER */}
            <div
              ref={(el) => shimRefSetter(el, 0)}
              className="absolute top-0 left-[-120%] w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"
            />

            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/b49067c4-bdc5-40cc-8964-6e50d21978ff_800w.jpg"
              className="w-full h-auto object-cover rounded-3xl"
              alt="Spending Overview"
            />
          </div>

          <div className="p-4">
            <p className="text-sm text-neutral-100">See where every rupee goes</p>
            <p className="text-xs text-neutral-300 mt-1">
              Auto-tagged categories like Swiggy, Uber, rent and fuel — with
              nudge alerts when lifestyle creep kicks in.
            </p>
          </div>
        </article>

        {/* Budget Card */}
        <article
          ref={(el) => cardRefSetter(el, 1)}
          className="nf-card relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        >
          <div className="relative">
            {/* SHIMMER */}
            <div
              ref={(el) => shimRefSetter(el, 1)}
              className="absolute top-0 left-[-120%] w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"
            />

            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3c2ae75b-0a23-443d-a7d1-1a0defd8874e_800w.jpg"
              className="w-full h-auto object-cover rounded-3xl"
              alt="Budget Overview"
            />
          </div>

          <div className="p-4">
            <p className="text-sm text-neutral-100">AI-built Indian budgets</p>
            <p className="text-xs text-neutral-300 mt-1">
              NueroFin reads your last 6 months of spends and proposes monthly
              caps tuned to your city and lifestyle.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
