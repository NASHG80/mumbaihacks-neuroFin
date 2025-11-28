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
import { AlertCircle, Coffee, ShoppingBag, Home, Car } from "lucide-react"
import { useState } from "react"

const SpendingGraph = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [timeframe, setTimeframe] = useState("6months")
  const [showIncome, setShowIncome] = useState(true)
  const [showSpending, setShowSpending] = useState(true)

  const data6months = [
    { month: "May", spending: 52000, income: 85000 },
    { month: "Jun", spending: 48000, income: 90000 },
    { month: "Jul", spending: 61000, income: 85000 },
    { month: "Aug", spending: 55000, income: 95000 },
    { month: "Sep", spending: 68000, income: 85000 },
    { month: "Oct", spending: 53000, income: 100000 }
  ]

  const data1year = [
    { month: "Nov '23", spending: 55000, income: 80000 },
    { month: "Dec '23", spending: 72000, income: 95000 },
    { month: "Jan", spending: 48000, income: 80000 },
    { month: "Feb", spending: 51000, income: 85000 },
    { month: "Mar", spending: 54000, income: 90000 },
    { month: "Apr", spending: 45000, income: 85000 },
    { month: "May", spending: 52000, income: 85000 },
    { month: "Jun", spending: 48000, income: 90000 },
    { month: "Jul", spending: 61000, income: 85000 },
    { month: "Aug", spending: 55000, income: 95000 },
    { month: "Sep", spending: 68000, income: 85000 },
    { month: "Oct", spending: 53000, income: 100000 }
  ]

  const data = timeframe === "6months" ? data6months : data1year

  const categories = [
    {
      name: "Dining",
      amount: 12500,
      percentage: 24,
      color: "#3b82f6", // Blue-500
      icon: Coffee
    },
    {
      name: "Shopping",
      amount: 18200,
      percentage: 34,
      color: "#8b5cf6", // Violet-500
      icon: ShoppingBag
    },
    {
      name: "Housing",
      amount: 15000,
      percentage: 28,
      color: "#f59e0b", // Amber-500
      icon: Home
    },
    {
      name: "Transport",
      amount: 7300,
      percentage: 14,
      color: "#f43f5e", // Rose-500
      icon: Car
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <p className="text-xs text-zinc-500 mb-2">
            {payload[0].payload.month}
          </p>
          <p className="text-[#3b82f6] text-sm font-medium mb-1">
            Spending: ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
          <p className="text-[#10b981] text-sm font-medium">
            Income: ₹{payload[1].value.toLocaleString("en-IN")}
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
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Intelligent Spending</h3>
          <p className="text-zinc-500 text-sm">
            AI-powered insights on your money flow
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-white/[0.08] text-white border border-white/5 text-xs font-medium"
          >
            This Month
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-transparent text-zinc-500 border border-transparent hover:bg-white/[0.02] text-xs"
          >
            Last 6 Months
          </motion.button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6 p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/10 flex items-center gap-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <p className="text-sm text-zinc-300">
          <span className="text-blue-400 font-medium">AI detected:</span> You spent 22%
          more on shopping this month. Consider setting a budget limit.
        </p>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="h-[300px] mb-8"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            onMouseMove={e => setHoveredPoint(e.activePayload)}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.2)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              style={{ fontSize: "12px" }}
              tickFormatter={value => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                strokeWidth: 0,
              }}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-xs text-zinc-500 uppercase tracking-wide mb-4">Top Spending Categories</h4>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5"
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-400">{category.name}</p>
                    <p className="text-lg font-medium text-white">
                      ₹{category.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: 1 + index * 0.1, duration: 1 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: category.color,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {category.percentage}% of total
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
export default SpendingGraph;