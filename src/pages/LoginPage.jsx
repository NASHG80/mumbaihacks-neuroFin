import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import gsap from "gsap";
import emailjs from "emailjs-com";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  const formRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- ANIMATIONS ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".glow-orb", {
        y: -40,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1.5,
      });

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        formRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- SPOTLIGHT EFFECT ---
  const handleMouseMove = (e) => {
    if (!cardRef.current || !overlayRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    overlayRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(125, 95, 255, 0.15) 0%, transparent 100%)`;
    overlayRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(125, 95, 255, 0.15) 0%, transparent 100%)`;
  };

  const sendOtp = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    // Calculate expiration time (15 minutes from now)
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await emailjs.send(
        "service_zbteh04", "template_znh5c1q",
        {
          passcode: code,
          time: expirationTime,
          email: email,
          name: "User",
        },
        "eW9Ky_pSMQyl9dfTn"
      );
      setOtpSent(true);
      setError("");
      alert("OTP sent to your email!");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- BACKEND INTEGRATION ---
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otpSent) {
      setError("Please verify your email with OTP first");
      setLoading(false);
      return;
    }

    if (otp !== generatedOtp) {
      setError("Invalid OTP");
      setLoading(false);
      return;
    }

    try {
      // CHANGED: Used relative path
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("Server returned a non-JSON response.");
      }

      if (!res.ok) {
        setError(data.message || "Login failed");
        gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
      } else {
        localStorage.setItem("nf_token", data.token);
        localStorage.setItem("nf_user", JSON.stringify(data.user));
        // After login, always go to card details flow first
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#05050A] text-white px-4"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6dcffc]/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="glow-orb absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#7d5fff]/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group"
      >
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        />

        <div className="relative z-10 p-8 sm:p-10 space-y-8">

          <div className="text-center space-y-2">
            <div ref={(el) => (formRefs.current[0] = el)} className="inline-block mb-2">
              <div className="h-10 w-10 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-xl border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/90">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 ref={(el) => (formRefs.current[1] = el)} className="text-3xl font-light tracking-tight text-white">
              Welcome back
            </h1>
            <p ref={(el) => (formRefs.current[2] = el)} className="text-sm text-neutral-400">
              Enter your coordinates to access the OS.
            </p>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div ref={(el) => (formRefs.current[3] = el)} className="group/input space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 ml-1 group-focus-within/input:text-[#6dcffc] transition-colors">
                EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nuerofin.in"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-[#6dcffc]/50 focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(109,207,252,0.15)]"
                />
              </div>
            </div>

            <div ref={(el) => (formRefs.current[4] = el)} className="group/input space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-medium text-neutral-500 group-focus-within/input:text-[#7d5fff] transition-colors">
                  PASSWORD
                </label>
                <Link to="/auth/forgot-password" className="text-xs text-neutral-500 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-[#7d5fff]/50 focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(125,95,255,0.15)]"
                />
              </div>
            </div>

            {/* OTP Section */}
            {otpSent && (
              <div className="group/input space-y-1.5">
                <label className="text-xs font-medium text-neutral-500 ml-1 group-focus-within/input:text-[#6dcffc] transition-colors">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-[#6dcffc]/50 focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(109,207,252,0.15)]"
                  />
                </div>
              </div>
            )}

            <div ref={(el) => (formRefs.current[5] = el)} className="pt-2">
              <button
                type="button"
                onClick={otpSent ? handleSubmit : sendOtp}
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-xl bg-white text-black font-semibold py-3.5 text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{loading ? "Authenticating..." : otpSent ? "Log In" : "Send OTP"}</span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shineSweep_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </button>
            </div>
          </form>



          <p ref={(el) => (formRefs.current[8] = el)} className="text-center text-xs text-neutral-500">
            New to Nuerofin?{" "}
            <Link to="/signup" className="text-white hover:underline underline-offset-4 decoration-neutral-500">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}