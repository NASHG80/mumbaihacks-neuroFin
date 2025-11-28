import { motion } from "framer-motion"
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Gift,
  Users,
  Home as HomeIcon
} from "lucide-react"
import { useState } from "react"

const FestivePlanner = () => {
  const [selectedFestival, setSelectedFestival] = useState(0)

  const festivals = [
    {
      name: "Diwali 2025",
      date: "Oct 20, 2025",
      daysLeft: 334,
      estimatedSpend: 85000,
      lastYearSpend: 72000,
      categories: [
        { name: "Gifts", amount: 35000, icon: Gift },
        { name: "Celebrations", amount: 25000, icon: Users },
        { name: "Decorations", amount: 15000, icon: HomeIcon },
        { name: "Shopping", amount: 10000, icon: Sparkles }
      ],
      color: "#f59e0b", // Amber
      emoji: "🪔"
    },
    {
      name: "Holi 2025",
      date: "Mar 14, 2025",
      daysLeft: 113,
      estimatedSpend: 25000,
      lastYearSpend: 22000,
      categories: [
        { name: "Colors & Supplies", amount: 8000, icon: Sparkles },
        { name: "Food & Drinks", amount: 10000, icon: Gift },
        { name: "Gatherings", amount: 7000, icon: Users }
      ],
      color: "#8b5cf6", // Violet
      emoji: "🎨"
    },
    {
      name: "New Year 2026",
      date: "Jan 1, 2026",
      daysLeft: 407,
      estimatedSpend: 50000,
      lastYearSpend: 45000,
      categories: [
        { name: "Travel", amount: 30000, icon: TrendingUp },
        { name: "Parties", amount: 15000, icon: Users },
        { name: "Gifts", amount: 5000, icon: Gift }
      ],
      color: "#3b82f6", // Blue
      emoji: "🎉"
    }
  ]

  const festival = festivals[selectedFestival]
  const savingsProgress = 45

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Festive Planner</h3>
          <p className="text-zinc-500 text-sm">
            Smart budgeting for celebrations
          </p>
        </div>
        <Calendar className="w-6 h-6 text-zinc-400" />
      </div>

      {/* Festival Selector */}
      <div className="flex gap-3 mb-6">
        {festivals.map((fest, index) => (
          <motion.button
            key={fest.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedFestival(index)}
            className={`flex-1 p-4 rounded-xl transition-all border ${
              selectedFestival === index
                ? "bg-white/[0.08] border-white/10"
                : "bg-transparent border-white/[0.05] hover:bg-white/[0.02]"
            }`}
          >
            <div className="text-2xl mb-2">{fest.emoji}</div>
            <p className={`text-xs font-medium ${selectedFestival === index ? "text-white" : "text-zinc-500"}`}>
                {fest.name.split(" ")[0]}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Festival Details */}
      <motion.div
        key={selectedFestival}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-2xl font-medium text-white mb-1">{festival.name}</p>
            <p className="text-zinc-500 text-sm">{festival.date}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Days Left</p>
            <p className="text-2xl font-medium" style={{ color: festival.color }}>
              {festival.daysLeft}
            </p>
          </div>
        </div>

        {/* Estimated Spend */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xs text-zinc-500 mb-1">Estimated</p>
            <p className="text-xl font-medium text-white">
              ₹{festival.estimatedSpend.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xs text-zinc-500 mb-1">Last Year</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium text-zinc-300">
                ₹{festival.lastYearSpend.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">Savings Progress</p>
            <p className="text-sm font-medium" style={{ color: festival.color }}>
              {savingsProgress}%
            </p>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savingsProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: festival.color }}
            />
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            ₹{Math.round((festival.estimatedSpend * savingsProgress) / 100).toLocaleString("en-IN")} saved
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Allocations</p>
          {festival.categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5"
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: festival.color }}
                    />
                  </div>
                  <p className="text-sm text-zinc-300">{category.name}</p>
                </div>
                <p className="text-sm font-medium text-white">
                  ₹{category.amount.toLocaleString("en-IN")}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors">
          Adjust Budget
        </button>
        <button className="p-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
          Save More
        </button>
      </div>
    </motion.div>
  )
}
export default FestivePlanner;