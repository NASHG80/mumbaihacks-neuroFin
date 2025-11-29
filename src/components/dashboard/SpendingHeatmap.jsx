import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const SpendingHeatmap = () => {
  const [forecastData, setForecastData] = useState([]);
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [loading, setLoading] = useState(true);

  function safeNum(n) {
    return Number(n) && !isNaN(Number(n)) ? Number(n) : 0;
  }

  // Fetch forecast from backend
  useEffect(() => {
    async function loadForecast() {
      try {
        const res = await fetch("http://localhost:7001/api/forecast/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "sandbox" })
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Backend returned non-JSON:", await res.text());
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Forecast result:", data);

        // Map forecast to graph-friendly dataset
        const oneMonth  = safeNum(data.next_month_total);
        const threeM    = safeNum(data.three_month_projection);
        const sixM      = safeNum(oneMonth * 6);
        const oneYear   = safeNum(data.year_projection);
        const twoYear   = safeNum(data.year_projection * 2);
        const fiveYear  = safeNum(data.five_year_projection);
        const tenYear   = safeNum(data.ten_year_projection);

        const chart = [
          { period: "1 Month", value: oneMonth },
          { period: "3 Months", value: threeM },
          { period: "6 Months", value: sixM },
          { period: "1 Year", value: oneYear },
          { period: "2 Years", value: twoYear },
          { period: "5 Years", value: fiveYear },
          { period: "10 Years", value: tenYear },
        ];

        setForecastData(chart);
        setCurrentNetWorth(oneMonth - threeM / 5);

      } catch (err) {
        console.error("Forecast fetch FAILED:", err);
      }

      setLoading(false);
    }

    loadForecast();
  }, []);

  // Tooltip UI
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-xs text-zinc-500 mb-2">{d.period}</p>
          <p className="text-emerald-400 text-lg font-medium mb-1">
            ₹{(d.value / 100000).toFixed(2)}L
          </p>
        </motion.div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="text-center text-zinc-400 p-6">
        Loading Forecast…
      </div>
    );

  if (!forecastData.length)
    return (
      <div className="text-center text-red-400 p-6">
        No forecast data available.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
      style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", minHeight: 500 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Wealth Forecast</h3>
          <p className="text-zinc-500 text-sm">AI-powered projection of your financial future</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-emerald-500" />
        </motion.div>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10">
          <p className="text-xs text-zinc-500 uppercase mb-2">Current Net Worth</p>
          <p className="text-3xl font-medium text-white">
            {formatCurrency(currentNetWorth)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
          <p className="text-xs text-zinc-500 uppercase mb-2">Future at 10Y</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <p className="text-3xl font-medium text-white">
              ₹{((forecastData[6]?.value ?? 0) / 100000).toFixed(2)}L
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="h-[320px] w-full mb-8 min-h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="period"
              stroke="rgba(255,255,255,0.2)"
              style={{ fontSize: "11px" }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              style={{ fontSize: "12px" }}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#forecastGradient)"
              dot={{
                fill: "#10b981",
                strokeWidth: 2,
                r: 5,
                stroke: "#0A0A0A",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Milestones */}
      <div>
        <h4 className="text-xs text-zinc-500 uppercase font-medium mb-4">Key Milestones</h4>
        <div className="grid grid-cols-2 gap-3">
          {forecastData.slice(2).map((m, i) => (
            <motion.div
              key={m.period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <p className="text-xs text-zinc-500">{m.period}</p>
              <p className="text-xl text-white">
                ₹{(m.value / 100000).toFixed(2)}L
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SpendingHeatmap;
