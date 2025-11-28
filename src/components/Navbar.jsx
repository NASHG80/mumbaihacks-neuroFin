"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navRef = useRef(null);
  const spotlightRef = useRef(null);
  const linksRef = useRef([]);
  const dropdownRef = useRef(null);

  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [hoveringService, setHoveringService] = useState(false);
 const [serviceOpen, setServiceOpen] = useState(false);  // 👈 NEW
  const navigate = useNavigate();

  /* ────────────────────────────────────────────────
      Hide / Reveal Navbar on scroll
  ──────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 60);
      setLastScroll(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  /* ────────────────────────────────────────────────
      Magnetic Hover + Premium Button Animations
  ──────────────────────────────────────────────── */
  useEffect(() => {
    /* Premium LOGIN Glow + Shine */
    const loginBtn = document.getElementById("login-premium");
    if (loginBtn) {
      const tl = gsap.timeline({ paused: true });

      tl.to(loginBtn, {
        letterSpacing: "0.06em",
        color: "white",
        ease: "power2.out",
        duration: 0.35,
      });

      tl.to(
        loginBtn,
        {
          textShadow:
            "0 0 8px rgba(255,255,255,0.5), 0 0 18px rgba(255,255,255,0.25)",
          ease: "power3.out",
          duration: 0.4,
        },
        "<0.05"
      );

      loginBtn.addEventListener("mouseenter", () => tl.play());
      loginBtn.addEventListener("mouseleave", () => tl.reverse());

      /* Shine restart */
      const shineEl = loginBtn.querySelector(".shine");
      if (shineEl) {
        loginBtn.addEventListener("mouseenter", () => {
          shineEl.style.animation = "none";
          shineEl.offsetHeight;
          shineEl.style.animation =
            "shineSweep 1s cubic-bezier(0.22, 1, 0.36, 1)";
        });
      }
    }

    /* Magnetic Hover for all links */
    linksRef.current.forEach((el) => {
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" });

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * 0.25);
        yTo((e.clientY - (rect.top + rect.height / 2)) * 0.25);
      });

      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }, []);

  /* ────────────────────────────────────────────────
      Spotlight Cursor Glow
  ──────────────────────────────────────────────── */
  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    window.addEventListener("mousemove", (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }, []);

  /* ────────────────────────────────────────────────
      Dropdown Animation (Service)
  ──────────────────────────────────────────────── */
 useEffect(() => {
    if (!dropdownRef.current) return;

    gsap.to(dropdownRef.current, {
      opacity: hoveringService || serviceOpen ? 1 : 0,          // 👈 UPDATED
      y: hoveringService || serviceOpen ? 0 : -10,               // 👈 UPDATED
      pointerEvents: hoveringService || serviceOpen ? "auto" : "none", // 👈 UPDATED
      duration: 0.25,
      ease: "power2.out",
    });
  }, [hoveringService, serviceOpen]); // 👈 UPDATED
  /* ────────────────────────────────────────────────
      JSX
  ──────────────────────────────────────────────── */
  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        bg-black/40 backdrop-blur-2xl border-b border-white/10
      `}
    >
      {/* Spotlight following cursor */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed w-[400px] h-[400px]
        -translate-x-1/2 -translate-y-1/2 
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]
        blur-3xl opacity-60"
      />

      {/* Ambient floating glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-[20%] top-[-20%] w-[30rem] h-[30rem] bg-sky-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute right-[10%] bottom-[-20%] w-[30rem] h-[30rem] bg-purple-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* NAVBAR MAIN */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">

        {/* LEFT — LOGO */}
        <div className="flex items-center gap-3 flex-none"
        onClick={() => navigate("/")}>
          <div className="w-9 h-9 bg-white/10 rounded-xl border border-white/20 
                          flex items-center justify-center backdrop-blur-xl 
                          shadow-[0_0_25px_rgba(255,255,255,0.1)]">
            <span className="text-xs text-white font-bold tracking-widest">NF</span>
          </div>

          <span className="text-sm tracking-[0.22em] font-medium text-white/90"
          onClick={() => navigate("/")}>
            NUEROFIN
          </span>
        </div>

        {/* CENTER NAV LINKS */}
        <nav className="flex-1 flex justify-center gap-10 text-sm text-white/70">

          {/* Service Dropdown */}
          <button
            ref={(el) => (linksRef.current[0] = el)}
            onMouseEnter={() => setHoveringService(true)}
            onMouseLeave={() => setHoveringService(false)}
            className="relative flex items-center gap-1.5 px-1 py-2 hover:text-white transition"
          >
            <span>Service</span>

            <svg
              className={`w-3 h-3 mt-[1px] transition-transform duration-200 ${
                hoveringService ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 7l5 6 5-6" />
            </svg>
          </button>

          <button
            ref={(el) => (linksRef.current[1] = el)}
            className="px-1 py-2 hover:text-white transition"
            onClick={() => navigate("/for-companies")}
          >
            For Companies
          </button>

          <button
            ref={(el) => (linksRef.current[2] = el)}
            className="px-1 py-2 hover:text-white transition"
            onClick={() => navigate("/launch")}
          >
            Launch Notes
          </button>
        </nav>

        {/* RIGHT — PREMIUM LOGIN + ULTRA SIGN UP */}
        <div className="flex items-center gap-6 flex-none">
                
          {/* PREMIUM LOGIN */}
          <button
            ref={(el) => (linksRef.current[3] = el)}
            id="login-premium"
            onClick={() => navigate("/login")}
            className="relative group px-5 py-2 font-medium text-white tracking-wide
                       rounded-lg transition-all duration-300
                       border border-white/10 bg-white/5 backdrop-blur-md
                       hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]
                       active:scale-[0.97]"
          >
            <span className="relative z-10">Log in</span>

            <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 
                             group-hover:opacity-100 transition-all duration-300"></span>

            <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <span className="shine"></span>
            </span>
          </button>
                
                
          {/* ULTRA SIGN UP */}
          <button
            id="signup-ultra"
            ref={(el) => (linksRef.current[4] = el)}
            onClick={() => navigate("/signup")}
            className="relative group px-6 py-2 font-semibold rounded-full
                       bg-white text-black
                       shadow-[0_0_35px_rgba(255,255,255,0.45)]
                       transition-all duration-300 
                       hover:shadow-[0_0_60px_rgba(255,255,255,0.7)]
                       hover:scale-[1.03] active:scale-[0.98]
                       flex items-center gap-2"
          >
            <span className="relative z-10">Sign Up</span>

            <svg
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M6 4l6 5-6 5" />
            </svg>

            <span className="absolute inset-0 rounded-full bg-white/40 blur-xl opacity-0 
                             group-hover:opacity-100 transition"></span>

            <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <span className="shine"></span>
            </span>
          </button>
          
        </div>
      </div>

      {/* DROPDOWN MENU */}
      <div
        ref={dropdownRef}
        onMouseEnter={() => setHoveringService(true)}
        onMouseLeave={() => setHoveringService(false)}
        className="absolute left-1/2 -translate-x-1/2 mt-2 w-[380px] rounded-2xl 
                   bg-black/70 backdrop-blur-2xl border border-white/10 p-5 
                   opacity-0 pointer-events-none"
      >
        <div className="flex flex-col gap-4 text-white/80 text-sm">
          <a className="hover:text-white transition"
           onClick={() => navigate("/spends-budgets")}>📊 Spends & Budgets</a>
          <a className="hover:text-white transition"
          onClick={() => navigate("/Upi-Bills")}>💸 UPI & Bills</a>
          <a className="hover:text-white transition"
          onClick={() => navigate("/Future-Planner")}>🔮 Future Planner</a>
          <a className="hover:text-white transition"
          onClick={() => navigate("/Family-Space")}>👨‍👩‍👧 Family Spaces</a>
        </div>
      </div>
    </header>
  );
}
