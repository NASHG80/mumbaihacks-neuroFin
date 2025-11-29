import { motion } from "framer-motion"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { TrendingUp, Sparkles } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "../../utils/currencyFormatter"

const SpendingHeatmap = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(null)

  // Forecast data - values will come from backend
  const forecastData = [
    { period: "1 Month", value: 350000, growth: 7.6 },
    { period: "3 Months", value: 385000, growth: 18.3 },
    { period: "6 Months", value: 425000, growth: 30.5 },
    { period: "1 Year", value: 520000, growth: 59.7 },
    { period: "2 Years", value: 680000, growth: 108.9 },
    { period: "5 Years", value: 1240000, growth: 280.9 },
    { period: "10 Years", value: 2450000, growth: 652.3 }
  ]

  const currentNetWorth = 325472

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-xs text-zinc-500 mb-2">{data.period}</p>
          <p className="text-emerald-400 text-lg font-medium mb-1">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-zinc-400">
            +{data.growth}% growth
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
      transition={{ delay: 0.4 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Wealth Forecast</h3>
          <p className="text-zinc-500 text-sm">
            AI-powered projection of your financial future
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-emerald-500" />
        </motion.div>
      </div>

      {/* Current vs Future Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">
            Current Net Worth
          </p>
          <p className="text-3xl font-medium text-white">
            {formatCurrency(currentNetWorth)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">
            Future at 10Y
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <p className="text-3xl font-medium text-white">
              {formatCurrency(forecastData[6].value)}
            </p>
          </div>
          <p className="text-xs text-emerald-400 mt-2">
            +{forecastData[6].growth}% growth
          </p>
        </motion.div>
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="h-[320px] mb-8"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={forecastData}
            onMouseMove={e => setSelectedPeriod(e.activePayload)}
          >
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
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
              tickFormatter={value => formatCurrency(value)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
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
                stroke: "#0A0A0A"
              }}
              activeDot={{
                r: 8,
                fill: "#10b981",
                strokeWidth: 3,
                stroke: "#0A0A0A"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Milestone Breakdown */}
      <div>
        <h4 className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-4">
          Key Milestones
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { period: "6 Months", value: forecastData[2].value, color: "#3b82f6" },
            { period: "1 Year", value: forecastData[3].value, color: "#8b5cf6" },
            { period: "5 Years", value: forecastData[5].value, color: "#f59e0b" },
            { period: "10 Years", value: forecastData[6].value, color: "#10b981" }
          ].map((milestone, index) => (
            <motion.div
              key={milestone.period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500 font-medium">{milestone.period}</p>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: milestone.color }}
                />
              </div>
              <p className="text-xl font-medium text-white">
                {formatCurrency(milestone.value)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-6 p-5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-400 mb-2">AI Projection</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Based on your current savings rate and investment returns, you're on track to achieve 
              ₹12.4L in 5 years. Increasing monthly contributions by 15% could accelerate this by 8 months.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SpendingHeatmap