import { motion } from "framer-motion"
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
  CartesianGrid
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

const InvestmentPortfolio = () => {
  const [showReturns, setShowReturns] = useState(true)
  const [activeIndex, setActiveIndex] = useState(null)

  // UPDATED PREMIUM PALETTE
  const portfolioData = [
    {
      name: "Equity Funds",
      value: 850000,
      color: "#3b82f6", // Royal Blue
      allocation: 46,
      returns: 18.5
    },
    {
      name: "Debt Funds",
      value: 450000,
      color: "#8b5cf6", // Violet
      allocation: 24,
      returns: 7.2
    },
    {
      name: "Gold",
      value: 200000,
      color: "#f59e0b", // Amber
      allocation: 11,
      returns: 12.8
    },
    {
      name: "Real Estate",
      value: 250000,
      color: "#f43f5e", // Rose
      allocation: 14,
      returns: 9.5
    },
    {
      name: "Fixed Deposits",
      value: 100000,
      color: "#10b981", // Emerald
      allocation: 5,
      returns: 6.5
    }
  ]

  const performanceData = [
    { month: "May", value: 1720000 },
    { month: "Jun", value: 1755000 },
    { month: "Jul", value: 1738000 },
    { month: "Aug", value: 1792000 },
    { month: "Sep", value: 1815000 },
    { month: "Oct", value: 1850000 }
  ]

  const totalInvestment = portfolioData.reduce(
    (sum, item) => sum + item.value,
    0
  )
  const totalReturns = 125000 // Mock data
  const returnsPercentage = (
    (totalReturns / (totalInvestment - totalReturns)) *
    100
  ).toFixed(2)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl"
        >
          <p className="text-sm font-medium text-white mb-2">{data.name}</p>
          <p className="text-xs text-zinc-400 mb-1">
            Investment: ₹{(data.value / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-zinc-400 mb-1">
            Allocation: {data.allocation}%
          </p>
          <p className="text-xs text-emerald-400 font-medium">Returns: +{data.returns}%</p>
        </motion.div>
      )
    }
    return null
  }

  const LineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-xs text-zinc-500 mb-1">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-blue-400 font-medium">
            ₹{(payload[0].value / 100000).toFixed(2)}L
          </p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      // CHANGED: Matte Black
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Investment Portfolio</h3>
          <p className="text-zinc-500 text-sm">
            Asset allocation & performance tracking
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReturns(!showReturns)}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          {showReturns ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Value - Blue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-zinc-500 font-medium">Total Value</p>
          </div>
          <p className="text-2xl font-medium text-white">₹{(totalInvestment / 100000).toFixed(2)}L</p>
        </motion.div>

        {/* Total Returns - Emerald */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-zinc-500 font-medium">Total Returns</p>
          </div>
          <motion.p
            key={showReturns ? "visible" : "hidden"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-medium text-emerald-500"
          >
            {showReturns ? `+₹${(totalReturns / 1000).toFixed(0)}k` : "••••••"}
          </motion.p>
        </motion.div>

        {/* Growth Rate - Violet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-2xl bg-violet-500/[0.03] border border-violet-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-violet-500" />
            <p className="text-sm text-zinc-500 font-medium">Growth Rate</p>
          </div>
          <motion.p
            key={showReturns ? "visible" : "hidden"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-medium text-violet-500"
          >
            {showReturns ? `+${returnsPercentage}%` : "••••"}
          </motion.p>
        </motion.div>

        {/* Target - Amber */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-zinc-500 font-medium">Target: 2025</p>
          </div>
          <p className="text-2xl font-medium text-white">₹25L</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart - Asset Allocation */}
        <div>
          <h4 className="text-sm text-zinc-500 font-medium uppercase tracking-wide mb-6">Asset Allocation</h4>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="h-[300px] relative"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none" // Clean look
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        activeIndex === null || activeIndex === index ? 1 : 0.3
                      }
                      style={{
                        filter:
                          activeIndex === index
                            ? `drop-shadow(0 0 10px ${entry.color}40)` // Subtle glow
                            : "none",
                        transition: "all 0.3s ease"
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-zinc-500 mb-1">Total Portfolio</p>
              <p className="text-2xl font-medium text-white">
                ₹{(totalInvestment / 100000).toFixed(1)}L
              </p>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            {portfolioData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}40`
                    }}
                  />
                  <span className="text-sm text-zinc-300">{item.name}</span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-medium text-white">₹{(item.value / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-zinc-500 w-8 text-right">{item.allocation}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Line Chart - Performance */}
        <div>
          <h4 className="text-sm text-zinc-500 font-medium uppercase tracking-wide mb-6">6-Month Performance</h4>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <defs>
                  <linearGradient
                    id="performanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.2)"
                  style={{ fontSize: "12px" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  style={{ fontSize: "12px" }}
                  tickFormatter={value => `₹${(value / 100000).toFixed(1)}L`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6" // Royal Blue
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "#3b82f6",
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                  }}
                  fill="url(#performanceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <div className="p-4 rounded-xl bg-blue-500/[0.03] border border-blue-500/10">
              <p className="text-xs text-zinc-500 mb-1">6-Month Growth</p>
              <p className="text-xl font-medium text-blue-500">+7.56%</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
              <p className="text-xs text-zinc-500 mb-1">Best Performer</p>
              <p className="text-xl font-medium text-emerald-500">Equity +18.5%</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 text-violet-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-400 mb-2">AI Portfolio Rebalancing Suggestion</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your equity allocation is optimal. Consider increasing debt
              allocation by 5% to reduce portfolio volatility. Expected impact:
              -2% risk, +1.2% stability.
            </p>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors"
              >
                Apply Suggestion
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default InvestmentPortfolio;