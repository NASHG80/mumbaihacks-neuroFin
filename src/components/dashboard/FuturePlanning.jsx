import { motion } from "framer-motion"
import {
  Sparkles,
  Heart,
  Home,
  Car,
  GraduationCap,
  Palmtree
} from "lucide-react"

const FuturePlanning = () => {
  const events = [
    {
      name: "Marriage",
      year: 2026,
      estimatedCost: 2500000,
      probability: 85,
      icon: Heart,
      color: "#f59e0b", // Amber
      status: "high-priority"
    },
    {
      name: "Dream Home",
      year: 2028,
      estimatedCost: 8500000,
      probability: 70,
      icon: Home,
      color: "#8b5cf6", // Violet
      status: "planned"
    },
    {
      name: "New Car",
      year: 2027,
      estimatedCost: 1200000,
      probability: 75,
      icon: Car,
      color: "#3b82f6", // Blue
      status: "planned"
    },
    {
      name: "Child's Education",
      year: 2035,
      estimatedCost: 5000000,
      probability: 60,
      icon: GraduationCap,
      color: "#f59e0b", // Amber
      status: "future"
    },
    {
      name: "Retirement",
      year: 2050,
      estimatedCost: 50000000,
      probability: 90,
      icon: Palmtree,
      color: "#3b82f6", // Blue
      status: "future"
    }
  ]

  const currentYear = 2024

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Future Planning</h3>
          <p className="text-xs text-zinc-500">AI-powered life timeline</p>
        </div>
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-blue-400" />
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line - Clean */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 opacity-50" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = event.icon
            const yearsAway = event.year - currentYear

            return (
              <motion.div
                key={event.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.15 }}
                className="relative flex gap-4"
              >
                {/* Timeline Node */}
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#0A0A0A]"
                    style={{
                      backgroundColor: `${event.color}15`, // 15% opacity
                      color: event.color
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  {/* Particle Animation */}
                  {index < 2 && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{ backgroundColor: event.color }}
                          animate={{
                            x: [0, Math.random() * 20 - 10],
                            y: [0, Math.random() * 20 - 10],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.6,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>

                {/* Event Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white mb-1">{event.name}</p>
                      <p className="text-xs text-zinc-500">
                        {event.year} • {yearsAway} years away
                      </p>
                    </div>
                    <div
                      className="px-2 py-1 rounded-md text-[10px] font-medium"
                      style={{
                        backgroundColor: `${event.color}15`,
                        color: event.color
                      }}
                    >
                      {event.probability}% likely
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">
                        Estimated Cost
                      </p>
                      <p className="text-sm font-medium" style={{ color: event.color }}>
                        ₹{(event.estimatedCost / 100000).toFixed(1)}L
                      </p>
                    </div>

                    {/* Mini Progress Indicator */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{
                            scaleY: i < event.probability / 20 ? 1 : 0.3
                          }}
                          transition={{ delay: 1 + index * 0.15 + i * 0.1 }}
                          className="w-1 h-5 rounded-full origin-bottom"
                          style={{
                            backgroundColor:
                              i < event.probability / 20
                                ? event.color
                                : "#ffffff10"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs text-blue-400 mb-1 font-medium">AI Recommendation</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Start saving ₹45,000/month now to comfortably achieve your
              marriage goal by 2026. Auto-invest enabled.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-sm font-medium text-white transition-all"
      >
        Adjust Timeline
      </motion.button>
    </motion.div>
  )
}
export default FuturePlanning;