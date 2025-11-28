import { motion } from "framer-motion"
import { Trophy, Flame, Lock, Star, Users } from "lucide-react"

const FinancialChallenges = () => {
  const challenges = [
    {
      name: "No-Spend Weekend",
      description: "Don't spend money for 2 days",
      progress: 85,
      maxProgress: 100,
      status: "active",
      reward: 500,
      badge: "gold",
      icon: Flame,
      streak: 12,
      color: "#f59e0b" // Amber
    },
    {
      name: "21-Day Savings Run",
      description: "Save ₹500 daily for 21 days",
      progress: 14,
      maxProgress: 21,
      status: "active",
      reward: 1000,
      badge: "platinum",
      icon: Star,
      streak: 14,
      color: "#8b5cf6" // Violet
    },
    {
      name: "Grocery Detox",
      description: "Stay under ₹5,000 this month",
      progress: 3200,
      maxProgress: 5000,
      status: "active",
      reward: 750,
      badge: "silver",
      icon: Trophy,
      color: "#3b82f6" // Blue
    },
    {
      name: "Investment Streak",
      description: "Invest for 30 days straight",
      progress: 0,
      maxProgress: 30,
      status: "locked",
      reward: 2000,
      badge: "platinum",
      icon: Lock,
      color: "#f43f5e" // Rose
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      // CHANGED: Matte Black Background
      className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Challenges</h3>
          <p className="text-xs text-zinc-500">Gamify your savings</p>
        </div>
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-5 h-5 text-amber-400" />
        </motion.div>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon
          const percentage = (challenge.progress / challenge.maxProgress) * 100
          const isLocked = challenge.status === "locked"

          return (
            <motion.div
              key={challenge.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={!isLocked ? { scale: 1.01 } : {}}
              className={`relative p-4 rounded-xl border overflow-hidden ${
                isLocked
                  ? "bg-white/[0.02] border-white/[0.04]"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
              } ${isLocked ? "opacity-60" : "cursor-pointer"}`}
            >
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isLocked ? "rgba(255,255,255,0.05)" : `${challenge.color}15`, // 15% opacity
                      color: isLocked ? "#71717a" : challenge.color
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{challenge.name}</p>
                      {!isLocked && challenge.streak && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                          <Flame className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] text-amber-500 font-medium">
                            {challenge.streak}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">
                      {challenge.description}
                    </p>

                    {/* Progress Bar */}
                    {!isLocked && (
                      <>
                        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.9 + index * 0.1
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: challenge.color }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            {challenge.progress} / {challenge.maxProgress}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span>₹{challenge.reward}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {isLocked && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Lock className="w-3 h-3" />
                        <span>Complete previous challenges to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Leaderboard Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Friends Leaderboard</p>
              <p className="text-xs text-zinc-500">You're #3 this week</p>
            </div>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
          >
            View
          </button>
        </div>
      </motion.div>

      {/* Total Rewards Earned */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between"
      >
        <p className="text-xs text-zinc-500">Total Rewards Earned</p>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <p className="text-sm font-medium text-white">₹4,250</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default FinancialChallenges;