import { motion } from "framer-motion";
import { bankLogos } from "../../data/bankLogos";



export default function UserCard({ card }) {
  const bankLogo = card.bank && bankLogos[card.bank] ? bankLogos[card.bank] : null;

  if (!card) return null;

  const glow =
    card.brand === "Visa"
      ? "shadow-[0_0_40px_rgba(30,144,255,0.35)]"
      : card.brand === "Mastercard"
      ? "shadow-[0_0_40px_rgba(255,120,20,0.35)]"
      : "shadow-[0_0_40px_rgba(0,200,120,0.35)]";

  return (
    <div className="w-full flex justify-center items-center my-6">
      <motion.div
        className={`relative w-[430px] h-[270px] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-black/40 ${glow}`}
        whileHover={{ scale: 1.02, rotateX: 4, rotateY: -3 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Shine animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-soft-light" />

        {/* Contents */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            {bankLogo ? (
  <img
    src={bankLogo}
    alt="bank-logo"
    className="w-[80px] h-6 object-contain opacity-90 drop-shadow-md"
  />
) : (
  <div className="text-gray-300 text-xs">{card.bank}</div>
)}

            {card.logoUrl && (
              <img
                src={card.logoUrl}
                className="w-[70px] h-6 object-contain opacity-90"
              />
            )}
          </div>

          <div className="tracking-widest text-2xl font-mono text-white mt-2 leading-relaxed">
            {card.number}
          </div>

          <div className="flex justify-between text-gray-300 text-sm mt-4">
            <div>
              <div className="text-[10px] text-gray-500">Card Holder</div>
              <div className="mt-1 font-medium text-white">{card.holder}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-gray-500">Expiry</div>
              <div className="mt-1 font-medium text-white">{card.expiry}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
