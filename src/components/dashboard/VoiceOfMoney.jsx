import { motion } from "framer-motion";
import { Volume2, Zap, Send } from "lucide-react";
import { useState, useEffect } from "react";

const VoiceOfMoney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const soundWaves = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    height: 20 + Math.random() * 60,
  }));

  // --- CALL BACKEND ---
const askAI = async () => {
  if (!question.trim()) return;
  setLoading(true);

  try {
    const res = await fetch("http://localhost:4000/api/v1/voice-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "111",
        question: question,
      }),
    });

    const data = await res.json();

    // Show AI text
    setAnswer(data.answer_text);

    // Create audio URL from base64
    const audioUrl = `data:${data.mimetype};base64,${data.audio_base64}`;

    const audioElement = new Audio(audioUrl);

    setAudio(audioElement);
    audioElement.play();
    setIsPlaying(true);

    audioElement.onended = () => setIsPlaying(false);

  } catch (e) {
    console.error("AI voice error:", e);
  }

  setLoading(false);
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      // CHANGED: Matte Black Background
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden relative"
    >
      {/* Background Animation - Subtle Gold Glow */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.03), transparent 60%)", // Amber-500
            "radial-gradient(circle at 80% 50%, rgba(217, 119, 6, 0.03), transparent 60%)",  // Amber-600
            "radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.03), transparent 60%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Voice of Money</h3>
            <p className="text-zinc-500 text-sm">
              Ask your financial questions — AI will speak the answer.
            </p>
          </div>
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your money…"
            // CHANGED: Dark Zinc Input
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] 
            text-sm text-white placeholder:text-zinc-600 outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={askAI}
            // CHANGED: Rich Amber Gradient Button
            className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black
            shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Audio Waves - Premium Blue to Gold Gradient */}
        <div className="h-40 flex items-center justify-center gap-1 mb-8 border-b border-white/[0.06]">
          {soundWaves.map((wave, index) => (
            <motion.div
              key={wave.id}
              className="w-1 rounded-full bg-gradient-to-t from-blue-600 via-indigo-500 to-amber-400"
              animate={{
                height: isPlaying
                  ? [
                      wave.height,
                      wave.height * 0.7,
                      wave.height * 1.3,
                      wave.height,
                    ]
                  : 20,
                opacity: isPlaying ? [0.6, 1, 0.8, 0.9] : 0.2,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.02,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* AI Spoken Text */}
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // CHANGED: Clean Matte Box
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                // CHANGED: Amber Icon Container
                className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500"
              >
                <Zap className="w-5 h-5" />
              </motion.div>

              <div className="flex-1">
                <p className="text-xs font-medium mb-2 text-amber-500 uppercase tracking-wide">AI Analysis</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceOfMoney;