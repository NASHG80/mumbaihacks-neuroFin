import {
  Send,
  Target,
  TrendingUp,
  Zap,
  MessageCircle,
  PiggyBank,
  CreditCard,
  ArrowRightLeft
} from "lucide-react"
import { motion } from "framer-motion"

export function QuickActionsPanel() {
  const actions = [
    {
      icon: Send,
      title: "Send Money",
      description: "Transfer to any account",
      color: "blue",
      bg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      border: "border-blue-500/20"
    },
    {
      icon: Target,
      title: "Create Goal",
      description: "Save for something special",
      color: "emerald",
      bg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/20"
    },
    {
      icon: TrendingUp,
      title: "Forecasts",
      description: "View predictions",
      color: "purple",
      bg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      border: "border-purple-500/20"
    },
    {
      icon: Zap,
      title: "Automations",
      description: "Set rules & triggers",
      color: "amber",
      bg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      border: "border-amber-500/20"
    },
    {
      icon: MessageCircle,
      title: "Talk to Advisor",
      description: "Get personalized advice",
      color: "indigo",
      bg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      border: "border-indigo-500/20"
    },
    {
      icon: PiggyBank,
      title: "Smart Savings",
      description: "Optimize your savings",
      color: "pink",
      bg: "bg-pink-500/20",
      iconColor: "text-pink-400",
      border: "border-pink-500/20"
    }
  ]

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="p-5 space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-white mb-1 font-medium">Quick Actions</h2>
        <p className="text-xs text-gray-400">Fast access to key features</p>
      </div>

      {/* Top Cards: Balance & Expenses */}
      <div className="space-y-3">
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-[#121218] border border-white/5 rounded-2xl p-4"
        >
            <div className="flex items-center gap-2 mb-2 text-gray-400">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Available Balance</span>
            </div>
            <p className="text-2xl font-light text-white">₹72,340</p>
        </motion.div>

        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-[#121218] border border-white/5 rounded-2xl p-4"
        >
            <div className="flex items-center gap-2 mb-2 text-gray-400">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-xs">Monthly Expenses</span>
            </div>
            <p className="text-2xl font-light text-white">₹28,450</p>
        </motion.div>
      </div>

      {/* This Month Summary (Moved Up) */}
      <div className="py-2 border-b border-white/5 pb-6">
        <p className="text-xs text-gray-400 mb-3">This Month</p>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Income</span>
                <span className="text-emerald-400">+₹65,000</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Expenses</span>
                <span className="text-white">-₹28,450</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Savings</span>
                <span className="text-blue-400">+₹36,550</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                <span className="text-white">Net Change</span>
                <span className="text-emerald-400">+56%</span>
            </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2.5 flex-1"
      >
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.button
              key={i}
              variants={item}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-[#121218] border border-white/5 hover:border-${action.color}-500/30 transition-all group text-left`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg} ${action.border} border`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">{action.title}</h3>
                <p className="text-[10px] text-gray-500">{action.description}</p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}