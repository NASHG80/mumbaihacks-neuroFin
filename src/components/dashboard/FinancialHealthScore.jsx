import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/v1/health-score/111";

const FinancialHealthScore = () => {
  const [score, setScore] = useState(0);
  const [metrics, setMetrics] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setScore(data.score || 0);
        setMetrics(data.metrics || []);
        setStatus("Score Updated");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load data");
      }
    };
    fetchScore();
  }, []);

  const scorePercentage = (score / 1000) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset =
    circumference - (scorePercentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-3xl flex items-center gap-2 text-white font-medium">
            Financial Health Score
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-zinc-500">Your financial wellness at a glance</p>
        </div>
        <button className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white">
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-12">
        <div className="relative">
          <svg width="320" height="320" className="-rotate-90">
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="#27272a"
              strokeWidth="20"
              fill="none"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              stroke="url(#grad)"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2 }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-7xl font-medium text-white">{score}</p>
            <p className="text-zinc-500">out of 1000</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-4 border border-white/5 rounded-xl bg-white/[0.02]"
            >
              <div className="flex justify-between items-center">
                <p className="text-zinc-300">{m.label}</p>
                <p className="text-xl font-medium text-white">{m.value}%</p>
              </div>
              <div className="w-full h-1.5 bg-white/10 mt-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <p className="text-sm text-emerald-400 font-medium">NeuroFin AI</p>
        <p className="text-zinc-300 mt-1">
          Your financial score has been updated in real-time. Explore each
          metric to see how you can improve.
        </p>
        <p className="text-xs text-zinc-500 mt-3">{status}</p>
      </div>
    </motion.div>
  );
};

export default FinancialHealthScore;