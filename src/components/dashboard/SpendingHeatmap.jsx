import { motion } from "framer-motion"
import { Calendar, TrendingUp, Flame } from "lucide-react"
import { useState } from "react"

const SpendingHeatmap = () => {
  const [selectedDay, setSelectedDay] = useState(null)

  // Generate 12 weeks of data
  const weeks = 12
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const heatmapData = Array.from({ length: weeks }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const spending = Math.floor(Math.random() * 15000) + 1000
      const date = new Date()
      date.setDate(
        date.getDate() - ((weeks - weekIndex - 1) * 7 + (6 - dayIndex))
      )
      return {
        week: weekIndex,
        day: dayIndex,
        spending,
        date: date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric"
        }),
        fullDate: date
      }
    })
  )

  const maxSpending = Math.max(...heatmapData.flat().map(d => d.spending))
  const avgSpending =
    heatmapData.flat().reduce((sum, d) => sum + d.spending, 0) / (weeks * 7)

  // PREMIUM COLOR SCALE
  const getIntensityColor = spending => {
    const intensity = spending / maxSpending
    // Amber (High) -> Emerald -> Blue -> Violet (Low) -> Zinc (Base)
    if (intensity > 0.8)
      return { bg: "#f59e0b", opacity: 1, glow: "0 0 15px rgba(245, 158, 11, 0.4)" } // Amber
    if (intensity > 0.6)
      return { bg: "#10b981", opacity: 0.9, glow: "0 0 12px rgba(16, 185, 129, 0.3)" } // Emerald
    if (intensity > 0.4)
      return { bg: "#3b82f6", opacity: 0.8, glow: "0 0 10px rgba(59, 130, 246, 0.3)" } // Blue
    if (intensity > 0.2) 
      return { bg: "#8b5cf6", opacity: 0.6, glow: "none" } // Violet
    return { bg: "#52525b", opacity: 0.2, glow: "none" } // Zinc-600
  }

  const topSpendingDays = heatmapData
    .flat()
    .sort((a, b) => b.spending - a.spending)
    .slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      // CHANGED: Matte Black Background
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden"
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Spending Heatmap</h3>
          <p className="text-zinc-500 text-sm">
            Daily spending intensity over 12 weeks
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Calendar className="w-6 h-6 text-blue-500" />
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">Avg Daily</p>
          <p className="text-2xl font-medium text-white">₹{(avgSpending / 1000).toFixed(1)}k</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">Peak Day</p>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <p className="text-2xl font-medium text-white">₹{(maxSpending / 1000).toFixed(1)}k</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">Total 12 Wks</p>
          <p className="text-2xl font-medium text-white">
            ₹{((avgSpending * weeks * 7) / 100000).toFixed(1)}L
          </p>
        </motion.div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          <div className="w-12" /> {/* Spacer for day labels */}
          {Array.from({ length: weeks }).map((_, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-zinc-600 font-medium">
              {i % 2 === 0 ? `W${i + 1}` : ""}
            </div>
          ))}
        </div>

        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="flex gap-2 mb-2">
            <div className="w-12 text-[10px] text-zinc-500 flex items-center font-medium">
              {day}
            </div>
            {heatmapData.map((week, weekIndex) => {
              const dayData = week[dayIndex]
              const colors = getIntensityColor(dayData.spending)
              const isSelected =
                selectedDay?.week === weekIndex && selectedDay?.day === dayIndex

              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.8 + (weekIndex * 7 + dayIndex) * 0.005
                  }}
                  whileHover={{ scale: 1.4, zIndex: 20 }}
                  onClick={() => setSelectedDay(dayData)}
                  className="flex-1 aspect-square rounded-md cursor-pointer relative group"
                  style={{
                    backgroundColor: colors.bg,
                    opacity: colors.opacity,
                    boxShadow: isSelected
                      ? `0 0 15px ${colors.bg}`
                      : colors.glow,
                    border: isSelected ? `2px solid #fff` : "none",
                    zIndex: isSelected ? 10 : 1
                  }}
                >
                  {/* Tooltip on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    whileHover={{ opacity: 1, y: -8, scale: 1 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl"
                  >
                    <p className="text-xs text-zinc-400 mb-1">{dayData.date}</p>
                    <p className="text-sm font-medium text-white">
                      ₹{dayData.spending.toLocaleString("en-IN")}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-md border border-white/[0.02]"
              style={{
                backgroundColor: getIntensityColor(intensity * maxSpending).bg,
                opacity: getIntensityColor(intensity * maxSpending).opacity
              }}
            />
          ))}
          <span className="text-xs text-zinc-500 font-medium">More</span>
        </div>
      </div>

      {/* Top Spending Days */}
      <div>
        <h4 className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-4">Top Spending Days</h4>
        <div className="space-y-3">
          {topSpendingDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              // CHANGED: Matte List Item
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/10 flex items-center justify-center">
                  <span className="text-rose-500 font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {day.fullDate.toLocaleDateString("en-IN", {
                      weekday: "long"
                    })}
                  </p>
                  <p className="text-xs text-zinc-500">{day.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-white">
                  ₹{day.spending.toLocaleString("en-IN")}
                </p>
                <div className="flex items-center gap-1 text-xs text-rose-500 justify-end">
                  <TrendingUp className="w-3 h-3" />
                  <span>
                    {((day.spending / avgSpending - 1) * 100).toFixed(0)}% above avg
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 text-violet-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-400 mb-2">Pattern Detected</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              You tend to spend 45% more on weekends. Consider setting weekend
              budgets to maintain consistency.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default SpendingHeatmap;