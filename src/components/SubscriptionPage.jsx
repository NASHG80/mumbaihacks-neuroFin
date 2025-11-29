import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);

  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { opacity: 0, y: 20, duration: 1 });
      gsap.from(descRef.current, { opacity: 0, y: 20, duration: 1, delay: 0.1 });
      gsap.from(cardRef.current, { opacity: 0, y: 35, duration: 1.2, delay: 0.2 });
    }, secRef);

    return () => ctx.revert();
  }, []);

  // 🔥 Razorpay Payment Function
  const handleBuy = async () => {
    try {
      setLoading(true);

      // 1️⃣ create order on backend
      const res = await fetch("http://localhost:5000/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const order = await res.json();

      if (!order.id) {
        alert("Order error. Try again.");
        return;
      }

      // 2️⃣ open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // 👈 now loaded correctly
        amount: order.amount,
        currency: order.currency,
        name: "NueroFin",
        description: "Founding Year Subscription",
        order_id: order.id,

        handler: function (response) {
          console.log("PAYMENT SUCCESS:", response);
          localStorage.setItem("nf_payment_id", response.razorpay_payment_id);
          window.location.href = "/details";
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section
      ref={secRef}
      className="relative w-full min-h-screen bg-[#00010D] text-white py-24 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 -z-10 opacity-90">
        <div className="absolute left-0 top-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_70%)] blur-[160px]" />
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,140,255,0.22),transparent_70%)] blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <h1 ref={titleRef} className="text-5xl sm:text-6xl font-light tracking-tight">
          Unlock your full <span className="opacity-80 italic">NueroFin</span> OS
        </h1>

        {/* Subtext */}
        <p ref={descRef} className="mt-6 text-neutral-300 text-lg max-w-2xl mx-auto">
          Get India’s smartest money OS — live tracking, AI suggestions,
          automatic bills, family syncing and unlimited goal planning.
        </p>

        {/* Subscription Card */}
        <div
          ref={cardRef}
          className="mt-16 mx-auto max-w-lg p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(120,0,255,0.1)] hover:shadow-[0_0_80px_rgba(120,0,255,0.2)] transition-all duration-500"
        >
          <h2 className="text-4xl font-semibold text-white">₹899</h2>
          <p className="text-neutral-400 mt-1 text-sm">Founding Year Access</p>

          <div className="h-px w-full bg-white/10 my-6" />

          <ul className="space-y-3 text-neutral-200 text-sm text-left mx-auto max-w-xs">
            <li className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" /> Live tracking of UPI, Cards & Accounts</li>
            <li className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" /> AI suggestions for goals & planning</li>
            <li className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" /> Auto-detected bills & subscription cleanup</li>
            <li className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" /> Family Spaces for shared goals</li>
            <li className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" /> Smart budgets with real-time protections</li>
          </ul>

          <div className="h-px w-full bg-white/10 my-6" />

          {/* Razorpay Button */}
          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-4 rounded-full bg-white text-black font-medium text-sm shadow-[0_30px_120px_rgba(255,255,255,0.2)] hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {loading ? "Processing…" : "Buy Subscription"}
          </button>

          <p className="mt-4 text-xs text-neutral-400">
            100% refund if you're not delighted.
          </p>
        </div>
      </div>
    </section>
  );
}
