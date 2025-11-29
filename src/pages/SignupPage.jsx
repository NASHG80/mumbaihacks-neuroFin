import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import emailjs from "emailjs-com";

export default function SignupPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const formRefs = useRef([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- ANIMATIONS ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".glow-orb-signup", {
        scale: 1.2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.4, ease: "power3.out" }
      );

      gsap.fromTo(
        formRefs.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.5,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    // Calculate expiration time (15 minutes from now)
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log("IDHAR HUN MEIN");
    try {
      await emailjs.send("service_zbteh04", "template_znh5c1q", {
        passcode: code,
        time: expirationTime,
        email: formData.email,
        name: formData.name,
      }, "eW9Ky_pSMQyl9dfTn");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

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
      // Ensure we are using the correct relative path that Vite proxies
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      // Handle non-JSON responses gracefully
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        // If the response is not JSON, it's likely an error page from the server (500, 404, etc.)
        // We throw an error to be caught by the catch block
        const text = await res.text();
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        setError(data.message || "Signup failed");
        gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
      } else {
        // SUCCESS: Store token and user data
        if (data.token) {
          localStorage.setItem("nf_token", data.token);
          localStorage.setItem("nf_user", JSON.stringify(data.user));
          // After signup, go to card details first
          navigate("/subscribe");
        } else {
          // Fallback: If for some reason token isn't returned on signup, redirect to login
          navigate("/login");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#05050A] text-white px-4 py-12"
    >
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-orb-signup absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-[#7d5fff]/15 blur-[140px] rounded-full" />
        <div className="glow-orb-signup absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-[#6dcffc]/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- CARD --- */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[460px] rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Top Accent Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px]"></div>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8">
            <p ref={el => formRefs.current[0] = el} className="text-[#6dcffc] text-xs font-bold tracking-[0.2em] mb-2">
              NUEROFIN ID
            </p>
            <h1 ref={el => formRefs.current[1] = el} className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Create your <br /> Money OS.
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div ref={el => formRefs.current[2] = el} className="group space-y-1">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-wider ml-3">FULL NAME</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Aditya Sharma"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Email */}
            <div ref={el => formRefs.current[3] = el} className="group space-y-1">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-wider ml-3">WORK OR PERSONAL EMAIL</label>
              <input
                name="email"
                type="email"
                required
                placeholder="aditya@company.com"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <div ref={el => formRefs.current[4] = el} className="group space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 tracking-wider ml-3">khufiya CODE</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                />
              </div>
              {/* Confirm */}
              <div ref={el => formRefs.current[5] = el} className="group space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 tracking-wider ml-3">CONFIRM</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* OTP Section */}
            {otpSent && (
              <div className="group space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 tracking-wider ml-3">ENTER OTP</label>
                <input
                  name="otp"
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                />
              </div>
            )}

            {/* Action Button */}
            <div ref={el => formRefs.current[6] = el} className="pt-4">
              <button
                type="button"
                onClick={otpSent ? handleSubmit : sendOtp}
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <div className="relative rounded-full bg-black/50 backdrop-blur-md px-8 py-4 transition-all duration-300 group-hover:bg-transparent">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold text-white tracking-wide">
                      {loading ? "Processing..." : otpSent ? "Verify & Signup" : "Send OTP"}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transition-transform group-hover:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                {/* Internal Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shineSweep_1s_ease-in-out] bg-white/20 blur-md" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div ref={el => formRefs.current[7] = el} className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              Already part of the cohort?{" "}
              <Link to="/login" className="text-[#6dcffc] hover:text-white transition-colors font-medium">
                Log in here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}