import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, CheckCircle } from "lucide-react";

// Load BIN data + Bank logos
import bins from "../data/bins.json";
import { bankLogos } from "../data/bankLogos";


export default function GiveDetails() {
  const [cardNumber, setCardNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [brand, setBrand] = useState("Unknown");
  const [bank, setBank] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [glow, setGlow] = useState("");
  const [bankLogoUrl, setBankLogoUrl] = useState("");


  const navigate = useNavigate();

  // Detect bank using BIN list
  function detectBank(num) {
    const bin = num.slice(0, 6);
    for (const bankName in bins) {
      if (bins[bankName].includes(bin)) return bankName;
    }
    return "";
  }

  const brandLogos = {
    Visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    Mastercard: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    Rupay: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/383px-RuPay.svg.png?20200901070738"
  };

  function formatCardNumber(value) {
    return value
      .replace(/[^0-9]/g, "")
      .slice(0, 19)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function detectAll(numRaw) {
    const num = numRaw.replace(/\s/g, "");

    if (num.length < 4) {
      setBrand("Unknown");
      setBank("");
      setLogoUrl("");
      setGlow("");
      return;
    }

    let detectedBrand = "Unknown";
    let glowClass = "";
    let brandLogo = "";

    // BRAND DETECTION (India accurate RuPay)
    if (/^4/.test(num)) {
      detectedBrand = "Visa";
      brandLogo = brandLogos.Visa;
      glowClass = "shadow-[0_0_40px_rgba(30,144,255,0.35)]";

    } else if (/^5[1-5]/.test(num)) {
      detectedBrand = "Mastercard";
      brandLogo = brandLogos.Mastercard;
      glowClass = "shadow-[0_0_40px_rgba(255,120,20,0.35)]";

    } else if (/^(508|606|607|608|652)/.test(num)) {
      detectedBrand = "Rupay";
      brandLogo = brandLogos.Rupay;
      glowClass = "shadow-[0_0_40px_rgba(0,200,120,0.35)]";
    }

    // BANK DETECTION
    // BANK DETECTION
    let detectedBank = detectBank(num);
    let detectedBankLogo = "";

    if (detectedBank && bankLogos[detectedBank]) {
      detectedBankLogo = bankLogos[detectedBank];
    } else {
      detectedBankLogo = ""; // fallback
    }

    setBank(detectedBank);
    setBankLogoUrl(detectedBankLogo);
    setBrand(detectedBrand);
    setGlow(glowClass);
    setLogoUrl(brandLogo);

  }


  useEffect(() => {
    detectAll(cardNumber);
  }, [cardNumber]);

  function formatExpiry(v) {
    const raw = v.replace(/[^0-9]/g, "").slice(0, 4);
    if (raw.length >= 3) return raw.slice(0, 2) + "/" + raw.slice(2);
    return raw;
  }

  function handleCardInput(v) {
    const formatted = formatCardNumber(v);
    detectAll(formatted);
    return formatted;
  }

  return (
    <div className="min-h-screen w-full bg-black text-white p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-14">

        <header className="text-center mt-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Enter Card Details</h1>
          <p className="text-gray-400 mt-3 text-sm">
            Secure and encrypted. We never store card data.
          </p>
        </header>

        {/* Security Highlights */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: <Shield />, label: "Bank-Grade Security" },
            { icon: <Zap />, label: "Instant Verification" },
            { icon: <CheckCircle />, label: "Secure Processing" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="font-medium text-gray-200">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CARD PREVIEW */}
        <div className="flex justify-center">
          <motion.div
            className={`relative w-[430px] h-[270px] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl ${glow}`}
            whileHover={{ scale: 1.03, rotateX: 4, rotateY: -4 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.55 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full h-full"
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 p-6 flex flex-col justify-between"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-start">
                  {bankLogoUrl ? (
                    <img
                      src={bankLogoUrl}
                      alt="bank-logo"
                      className="h-8 w-auto max-w-[120px] object-contain drop-shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-6 bg-white/10 rounded"></div>
                  )}

                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="brand-logo"
                      className="h-10 w-auto max-w-[150px] object-contain drop-shadow-lg"


                    />
                  ) : (
                    <div className="w-20 h-6 bg-white/10 rounded"></div>
                  )}
                </div>

                <div className="tracking-widest text-2xl font-mono text-center">
                  {cardNumber || "#### #### #### ####"}
                </div>

                <div className="flex justify-between text-sm text-gray-300">
                  <div>
                    <div className="text-xs text-gray-500">Card Holder</div>
                    <div className="font-medium mt-1">{holder || "FULL NAME"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Expiry</div>
                    <div className="font-medium mt-1">{expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 p-6"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(160deg, rgba(0,0,0,0.8), rgba(15,15,15,0.95))"
                }}
              >
                <div className="h-12 bg-black w-full rounded-sm" />
                <div className="mt-6 flex justify-end">
                  <div className="bg-white h-8 w-24 rounded text-black flex items-center justify-center font-bold">
                    ***
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-400">Card Holder</label>
              <input
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                className="mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Card Number</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(handleCardInput(e.target.value))}
                className="mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Expiry</label>
              <input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">CVV</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                className="mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 w-full"
                type="password"
              />
            </div>
          </div>

          <div className="text-sm text-gray-300">Brand: {brand}</div>
          <div className="text-sm text-gray-300">Bank: {bank || "Detecting..."} </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center relative z-50">
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-lg"
            onClick={async () => {
              const cardData = {
                number: cardNumber,
                holder,
                expiry,
                brand,
                bank,
                logoUrl
              };

              const token = localStorage.getItem("nf_token");

              try {
                const res = await fetch("/api/card", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify(cardData)
                });

                if (res.ok) {
                  navigate("/dashboard");
                } else {
                  if (res.status === 401) {
                    alert("Session expired. Please login again.");
                    navigate("/login");
                  } else {
                    alert("Error saving card details. Proceeding to dashboard.");
                    navigate("/dashboard");
                  }
                }
              } catch (err) {
                console.error(err);
                alert("Network error. Proceeding to dashboard.");
                navigate("/dashboard");
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
