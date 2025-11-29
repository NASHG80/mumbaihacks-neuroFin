import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";

const InvestmentPortfolio = () => {
  const [showReturns, setShowReturns] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  const [allocations, setAllocations] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestment() {
      try {
        console.log("📡 Fetching investment data…");

        const res = await fetch("http://localhost:7001/api/investment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "sandbox" }),
        });

        if (!res.ok) {
          console.error("❌ Server returned:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Investment agent response:", data);

        setAllocations(data.allocations || []);
        setPerformance(data.performance || []);
        setTotalValue(data.total_value || 0);
        setRiskLevel(data.risk_level || "LOW");
        setRiskScore(data.risk_score || 0);

      } catch (err) {
        console.error("Investment fetch failed:", err);
      }

      setLoading(false);
    }

    loadInvestment();
  }, []);

  // ---- LOADING ---------------------------------------------------
  if (loading) {
    return (
      <div className="text-center text-zinc-400 p-6">
        Loading investment data…
      </div>
    );
  }

  // ---- NO DATA ---------------------------------------------------
  if (!allocations.length) {
    return (
      <div className="text-center text-red-400 p-6">
        No investment data found.
      </div>
    );
  }

  // ---- TOOLTIP COMPONENTS -----------------------------------------
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-sm font-medium text-white mb-2">{d.name}</p>
          <p className="text-xs text-zinc-400 mb-1">
            Invested: ₹{d.value.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-400 mb-1">
            Allocation: {d.allocation}%
          </p>
          {showReturns && (
            <p className="text-xs text-emerald-400 font-medium">
              Returns: +{d.returns}%
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-xs text-zinc-500 mb-1">{d.month}</p>
          <p className="text-sm text-blue-400 font-medium">
            ₹{(d.value / 100000).toFixed(2)}L
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Investment Portfolio</h3>
          <p className="text-zinc-500 text-sm">
            Based on your real monthly sandbox spending data
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReturns(!showReturns)}
          className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10"
        >
          {showReturns ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* TOTAL VALUE */}
        <div className="p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-zinc-500">Total Value</p>
          </div>
          <p className="text-2xl font-medium text-white">
            ₹{(totalValue / 100000).toFixed(2)}L
          </p>
        </div>

        {/* RISK SCORE */}
        <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-zinc-500">Risk Score</p>
          </div>
          <p className="text-2xl font-medium text-emerald-500">
            {riskScore}/100
          </p>
        </div>

        {/* RISK LEVEL */}
        <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-zinc-500">Risk Level</p>
          </div>
          <p className="text-2xl font-medium text-white">{riskLevel}</p>
        </div>

        {/* PERFORMANCE TREND */}
        <div className="p-5 rounded-2xl bg-violet-500/[0.03] border border-violet-500/10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            <p className="text-sm text-zinc-500">Performance Trend</p>
          </div>
          <p className="text-2xl font-medium text-violet-500">
            {performance.length} months
          </p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE CHART */}
        <div>
          <h4 className="text-sm text-zinc-500 font-medium uppercase tracking-wide mb-6">
            Asset Allocation
          </h4>

          <div className="h-[300px] relative w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {allocations.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={`hsl(${index * 50}, 85%, 65%)`}
                      opacity={
                        activeIndex === null || activeIndex === index ? 1 : 0.3
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER LABEL */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-zinc-500 mb-1">Total</p>
              <p className="text-2xl font-medium text-white">
                ₹{(totalValue / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </div>

        {/* LINE CHART */}
        <div>
          <h4 className="text-sm text-zinc-500 font-medium uppercase tracking-wide mb-6">
            Monthly Growth
          </h4>

          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.2)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI INSIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <p className="text-sm font-medium text-emerald-400 mb-2">AI Insight</p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Based on your spending patterns, your long-term financial momentum is{" "}
          <span className="text-emerald-400 font-medium">{riskLevel}</span>.
          Increasing SIPs and diversifying your investments would strengthen your financial stability.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default InvestmentPortfolio;
