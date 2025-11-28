import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { useState } from "react"

const CashFlowAnalysis = () => {
  const [timeframe, setTimeframe] = useState("6months")

  const data = {
    "6months": [
      { month: "May", income: 85000, expenses: 52000, savings: 33000 },
      { month: "Jun", income: 90000, expenses: 48000, savings: 42000 },
      { month: "Jul", income: 85000, expenses: 61000, savings: 24000 },
      { month: "Aug", income: 95000, expenses: 55000, savings: 40000 },
      { month: "Sep", income: 85000, expenses: 68000, savings: 17000 },
      { month: "Oct", income: 100000, expenses: 53000, savings: 47000 }
    ],
    "1year": [
      { month: "Nov '23", income: 80000, expenses: 55000, savings: 25000 },
      { month: "Dec '23", income: 95000, expenses: 72000, savings: 23000 },
      { month: "Jan", income: 80000, expenses: 48000, savings: 32000 },
      { month: "Feb", income: 85000, expenses: 51000, savings: 34000 },
      { month: "Mar", income: 90000, expenses: 54000, savings: 36000 },
      { month: "Apr", income: 85000, expenses: 45000, savings: 40000 },
      { month: "May", income: 85000, expenses: 52000, savings: 33000 },
      { month: "Jun", income: 90000, expenses: 48000, savings: 42000 },
      { month: "Jul", income: 85000, expenses: 61000, savings: 24000 },
      { month: "Aug", income: 95000, expenses: 55000, savings: 40000 },
      { month: "Sep", income: 85000, expenses: 68000, savings: 17000 },
      { month: "Oct", income: 100000, expenses: 53000, savings: 47000 }
    ],
    "2years": [
      { month: "Q4 '22", income: 240000, expenses: 180000, savings: 60000 },
      { month: "Q1 '23", income: 255000, expenses: 165000, savings: 90000 },
      { month: "Q2 '23", income: 260000, expenses: 172000, savings: 88000 },
      { month: "Q3 '23", income: 265000, expenses: 195000, savings: 70000 },
      { month: "Q4 '23", income: 275000, expenses: 210000, savings: 65000 },
      { month: "Q1 '24", income: 255000, expenses: 153000, savings: 102000 },
      { month: "Q2 '24", income: 260000, expenses: 161000, savings: 99000 },
      { month: "Q3 '24", income: 265000, expenses: 184000, savings: 81000 }
    ]
  }

  const currentData = data[timeframe]
  const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = currentData.reduce(
    (sum, item) => sum + item.expenses,
    0
  )
  const totalSavings = currentData.reduce((sum, item) => sum + item.savings, 0)
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1)

  const avgIncome = Math.round(totalIncome / currentData.length)
  const avgExpenses = Math.round(totalExpenses / currentData.length)
  const avgSavings = Math.round(totalSavings / currentData.length)

  const prevPeriodSavings = 28000 // Mock data for comparison
  const savingsChange = (
    ((avgSavings - prevPeriodSavings) / prevPeriodSavings) *
    100
  ).toFixed(1)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          // CHANGED: Matte Black Tooltip
          className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl"
        >
          <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wide font-medium">
            {payload[0].payload.month}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-zinc-400">Income</span>
              </div>
              <span className="text-sm font-medium text-white">
                ₹{payload[0].value.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs text-zinc-400">Expenses</span>
              </div>
              <span className="text-sm font-medium text-white">
                ₹{payload[1].value.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-zinc-400">Savings</span>
              </div>
              <span className="text-sm font-medium text-white">
                ₹{payload[2].value.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      // CHANGED: Matte Black Background
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Cash Flow Analysis</h3>
          <p className="text-zinc-500 text-sm">Income, expenses & savings breakdown</p>
        </div>
        <div className="flex gap-2">
          {["6months", "1year", "2years"].map(period => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                timeframe === period
                  ? "bg-white/[0.08] text-white border border-white/5"
                  : "bg-transparent text-zinc-500 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {period === "6months" ? "6M" : period === "1year" ? "1Y" : "2Y"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Income Card - Emerald */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.05] to-transparent border border-emerald-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Avg Income</p>
          </div>
          <p className="text-2xl font-medium text-white mb-1">₹{(avgIncome / 1000).toFixed(0)}k</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.5%</span>
          </div>
        </motion.div>

        {/* Expenses Card - Rose */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/[0.05] to-transparent border border-rose-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10">
              <TrendingDown className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Avg Expenses</p>
          </div>
          <p className="text-2xl font-medium text-white mb-1">₹{(avgExpenses / 1000).toFixed(0)}k</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
            <ArrowDownRight className="w-3 h-3" />
            <span>-3.2%</span>
          </div>
        </motion.div>

        {/* Savings Card - Blue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/[0.05] to-transparent border border-blue-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Avg Savings</p>
          </div>
          <p className="text-2xl font-medium text-white mb-1">₹{(avgSavings / 1000).toFixed(0)}k</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{savingsChange}%</span>
          </div>
        </motion.div>

        {/* Savings Rate Card - Amber */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/[0.05] to-transparent border border-amber-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
              <div className="text-sm font-bold text-amber-500">%</div>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Savings Rate</p>
          </div>
          <p className="text-2xl font-medium text-white mb-1">{savingsRate}%</p>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savingsRate}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} barGap={8}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
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
              tickFormatter={value => `₹${(value / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              formatter={value => (
                <span
                  style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: 500 }}
                >
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="income"
              fill="url(#incomeGradient)"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expenses"
              fill="url(#expensesGradient)"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
            <Bar
              dataKey="savings"
              fill="url(#savingsGradient)"
              radius={[4, 4, 0, 0]}
              name="Savings"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-4 rounded-xl bg-blue-500/[0.03] border border-blue-500/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">Peak Saving Month</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                October with ₹47,000 saved - Your best month this year!
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">Smart Insight</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your savings rate is 12% above the national average. Excellent
                work!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default CashFlowAnalysis;