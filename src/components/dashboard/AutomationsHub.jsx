import { motion } from "framer-motion";
import { Zap, Plus, ChevronRight, DollarSign, PiggyBank, CreditCard, TrendingUp } from "lucide-react";

const AutomationsHub = () => {
  const automations = [
    {
      name: "Salary Auto-Allocator",
      description: "When salary arrives → Move 20% to savings → Pay bills → Invest ₹10k",
      active: true,
      nodes: [
        { icon: DollarSign, label: "Salary In", color: "#10b981" }, // Emerald
        { icon: PiggyBank, label: "20% Save", color: "#3b82f6" },   // Blue
        { icon: CreditCard, label: "Pay Bills", color: "#f43f5e" }, // Rose
        { icon: TrendingUp, label: "Invest", color: "#8b5cf6" }     // Violet
      ],
      triggers: 47,
      saved: 135000
    },
    {
      name: "Festival Savings",
      description: "Auto-save ₹5,000 weekly for upcoming Diwali",
      active: true,
      nodes: [
        { icon: DollarSign, label: "Weekly", color: "#3b82f6" },    // Blue
        { icon: PiggyBank, label: "₹5k Save", color: "#f59e0b" }    // Amber
      ],
      triggers: 12,
      saved: 60000
    },
    {
      name: "Smart Bill Pay",
      description: "Auto-pay utilities when balance > ₹50k",
      active: false,
      nodes: [
        { icon: DollarSign, label: "Check Balance", color: "#71717a" }, // Zinc
        { icon: CreditCard, label: "Pay Bills", color: "#71717a" }      // Zinc
      ],
      triggers: 0,
      saved: 0
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      // CHANGED: Matte Black Background
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-medium text-white">Automations Hub</h3>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Zap className="w-5 h-5 text-amber-400" />
            </motion.div>
          </div>
          <p className="text-zinc-500 text-sm">Set it and forget it - Money on autopilot</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {automations.map((automation, index) => (
          <motion.div
            key={automation.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className={`relative p-6 rounded-xl border cursor-pointer overflow-hidden ${
              automation.active
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-transparent border-white/[0.04] opacity-50"
            }`}
          >
            {automation.active && (
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.05), transparent 50%)", // Subtle Blue
                    "radial-gradient(circle at 100% 50%, rgba(16, 185, 129, 0.05), transparent 50%)", // Subtle Emerald
                    "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.05), transparent 50%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{automation.name}</h4>
                    {automation.active && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        style={{ boxShadow: "0 0 8px rgba(16,185,129,0.4)" }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{automation.description}</p>
                </div>

                <motion.div whileHover={{ x: 5 }} className="flex-shrink-0">
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {automation.nodes.map((node, nodeIndex) => {
                  const Icon = node.icon;
                  return (
                    <div key={nodeIndex} className="flex items-center gap-2 flex-shrink-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 + nodeIndex * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="relative"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border"
                          style={{
                            backgroundColor: `${node.color}10`, // 10% opacity
                            borderColor: `${node.color}30`,
                            color: node.color
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {automation.active && nodeIndex < automation.nodes.length - 1 && (
                          <motion.div
                            className="absolute top-1/2 left-full w-1 h-1 rounded-full"
                            style={{ backgroundColor: node.color }}
                            animate={{ x: [0, 20], opacity: [1, 0] }}
                            transition={{ duration: 1.5, delay: nodeIndex * 0.3, repeat: Infinity, repeatDelay: 2 }}
                          />
                        )}
                      </motion.div>

                      {nodeIndex < automation.nodes.length - 1 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1.3 + index * 0.1 + nodeIndex * 0.1 }}
                          className="h-px w-6 bg-white/10 origin-left"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {automation.active && (
                <div className="flex items-center gap-6 text-xs pt-3 border-t border-white/[0.06]">
                  <div>
                    <p className="text-zinc-500 mb-1">Triggered</p>
                    <p className="text-zinc-200 font-medium">{automation.triggers}x</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Total Saved</p>
                    <p className="text-emerald-400 font-medium">₹{(automation.saved / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Total Automated Savings</p>
            <motion.p
              className="text-3xl font-medium text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              ₹1,95,000
            </motion.p>
          </div>

          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center border border-white/5"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <p className="text-xs text-zinc-500 mt-3">Your automations saved you ₹12,000 this week without any manual effort</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-4 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-zinc-400">
              <span className="text-amber-500 font-medium">Pro Tip:</span> Create custom automation flows with conditions and multiple actions
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default AutomationsHub;