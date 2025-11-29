import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import emailjs from "emailjs-com";
import { X, Loader2 } from "lucide-react";

const features = [
  {
    title: "Company-wide budgets",
    subtitle: "Set team caps, allocate budgets, and auto-notify owners.",
    bullets: [
      "Role-based spend controls",
      "Dept & project allocations",
      "Real-time burn dashboard",
    ],
    tag: "Finance",
  },
  {
    title: "Payroll & reimbursements",
    subtitle: "Streamline reimbursements and direct payroll insights.",
    bullets: [
      "One-click reimbursements",
      "Policy enforcement",
      "Fast accounting exports",
    ],
    tag: "HR",
  },
  {
    title: "Compliance & audits",
    subtitle: "Audit trails, tax-ready reports and KYC guardrails.",
    bullets: ["Immutable logs", "Tax-ready exports", "Access controls"],
    tag: "Security",
  },
  {
    title: "Integrations",
    subtitle: "Connect your accounting, HRIS and expense tools.",
    bullets: ["Xero / QuickBooks", "BambooHR / Workday", "Custom webhooks"],
    tag: "Integrations",
  },
];

export default function ForCompaniesSection() {
  const secRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("eW9Ky_pSMQyl9dfTn");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        "service_zbteh04",
        "template_i66pknj",
        formRef.current,
        "eW9Ky_pSMQyl9dfTn"
      );
      alert("Message sent successfully! We'll be in touch.");
      setIsModalOpen(false);
      formRef.current.reset();
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(
        descRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.12, ease: "power3.out" }
      );

      gsap.fromTo(
        cardsRef.current,
        { y: 36, opacity: 0, scale: 0.995 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.14,
          delay: 0.25,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ctaRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.7, ease: "power2.out" }
      );
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative z-10 w-full py-24 text-white bg-[#00010D] overflow-visible"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(10,26,47,0.9) 0%, rgba(0,1,13,0.95) 70%)",
        }}
      />

      {/* Soft texture */}
      <div
        className="absolute inset-0 z-0 mix-blend-screen opacity-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/mnt/data/4d8575d4-d11a-4cb0-b99f-be810f6884dc.png')",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="inline-block text-sm py-1 px-3 rounded-full bg-emerald-900/30 border border-emerald-700 text-emerald-300 font-medium tracking-wide">
            For Companies · NueroFin
          </p>

          <h2
            ref={titleRef}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-light leading-tight"
          >
            Manage company money with one secure control plane.
          </h2>

          <p
            ref={descRef}
            className="mt-6 text-lg text-gray-300 max-w-xl"
          >
            Enterprise controls, compliance-ready reporting, and seamless
            integrations — all tuned to how modern Indian companies actually run
            finance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <article
              key={f.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="relative p-6 rounded-2xl bg-[#0F212B]/80 border border-white/8 backdrop-blur-lg shadow-md hover:shadow-emerald-600/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-1 rounded-md text-xs bg-white/6 border border-white/12">
                      {f.tag}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-semibold">
                      {f.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{f.subtitle}</p>
                </div>

                <div className="text-sm text-emerald-300 font-medium">
                  {f.tag}
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

              {/* Footer text ONLY (no learn more button) */}
              <div className="mt-4 text-xs text-gray-500">
                Trusted by early adopters across India.
              </div>
            </article>
          ))}
        </div>

        {/* CTA Row */}
        <div className="mt-12 flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          <div className="max-w-3xl">
            <h4 className="text-2xl font-semibold">
              Enterprise-ready. Human-friendly.
            </h4>
            <p className="mt-2 text-gray-300">
              Book a demo for custom SLAs, dedicated onboarding, and large-scale
              data migrations. Designed for finance teams who need control
              without friction.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                ref={ctaRef}
                onClick={() => setIsModalOpen(true)}
                className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500 text-black font-semibold shadow-[0_8px_30px_rgba(16,185,129,0.12)] hover:scale-[1.02] transition"
              >
                Book a demo
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm px-4 py-2 rounded-md border border-white/8 text-gray-200 hover:bg-white/3 transition"
              >
                Contact sales
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-start lg:items-end">
            <div className="flex gap-3 items-center text-sm text-gray-400">
              <span className="px-2 py-1 bg-white/6 rounded">PCI-DSS</span>
              <span className="px-2 py-1 bg-white/6 rounded">ISO 27001</span>
              <span className="px-2 py-1 bg-white/6 rounded">SOC2</span>
            </div>

            <div className="mt-2 flex gap-3">
              <div className="w-14 h-10 rounded bg-white/4 flex items-center justify-center text-xs">
                Xero
              </div>
              <div className="w-14 h-10 rounded bg-white/4 flex items-center justify-center text-xs">
                QB
              </div>
              <div className="w-14 h-10 rounded bg-white/4 flex items-center justify-center text-xs">
                BambooHR
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Enterprise features subject to eligibility. Contact sales for pricing &
          integrations.
        </div>
      </div>

      {/* CONTACT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="bg-[#0F212B] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-semibold mb-1">Get in touch</h3>
            <p className="text-sm text-gray-400 mb-6">Fill out the form below and our team will get back to you.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
