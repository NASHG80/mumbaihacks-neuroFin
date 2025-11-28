import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Zap, Plus, X } from "lucide-react"
import { useState } from "react"

const TransactionFlow = ({ transactions = [], onAddTransaction }) => {
  const [filter, setFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'expense', amount: '', category: 'Food', description: '' });

  const displayTransactions = transactions || [];

  const filteredTransactions = displayTransactions.filter(
    t => filter === "all" || t.type === filter
  )

  // UPDATED PREMIUM PALETTE
  const getCategoryColor = category => {
    const colors = {
      Salary: "#10b981",        // Emerald
      Shopping: "#8b5cf6",      // Violet
      Food: "#f59e0b",          // Amber
      Freelance: "#3b82f6",     // Royal Blue
      Transport: "#f43f5e",     // Rose
      Entertainment: "#ec4899", // Pink
      Investment: "#06b6d4",    // Cyan
      Bills: "#71717a"          // Zinc
    }
    return colors[category] || "#FFFFFF"
  }

  const totalIncome = displayTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = displayTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onAddTransaction) return;
    
    onAddTransaction({
        id: Date.now(),
        type: newTx.type,
        from: newTx.type === 'income' ? newTx.description : 'HDFC Account',
        to: newTx.type === 'income' ? 'HDFC Account' : newTx.description,
        amount: Number(newTx.amount),
        time: 'Just now',
        category: newTx.category,
        description: newTx.description,
        status: 'completed'
    });
    setIsModalOpen(false);
    setNewTx({ type: 'expense', amount: '', category: 'Food', description: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      // CHANGED: Matte Black Background
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] backdrop-blur-xl"
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">Transaction Flow</h3>
          <p className="text-zinc-500 text-sm">
            Real-time money movement visualization
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "income", "expense"].map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                filter === f
                  ? "bg-white/[0.08] text-white border border-white/5"
                  : "bg-transparent text-zinc-500 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {f}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    // CHANGED: Matte Modal
                    className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-medium text-white">Add Transaction</h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                            {['expense', 'income'].map(t => (
                                <button
                                    key={t} type="button"
                                    onClick={() => setNewTx({...newTx, type: t})}
                                    className={`flex-1 py-2 rounded-lg capitalize text-sm font-medium transition-all ${newTx.type === t ? (t === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500') : 'text-zinc-500 hover:text-white'}`}
                                >{t}</button>
                            ))}
                        </div>
                        <input 
                            type="text" placeholder="Description (e.g. Uber, Salary)" required
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 text-white placeholder:text-zinc-600 transition-all text-sm"
                            value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})}
                        />
                        <input 
                            type="number" placeholder="Amount" required
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 text-white placeholder:text-zinc-600 transition-all text-sm"
                            value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})}
                        />
                        <select 
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 appearance-none text-white text-sm"
                            value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})}
                        >
                            {['Food', 'Transport', 'Shopping', 'Salary', 'Freelance', 'Bills', 'Entertainment'].map(c => (
                                <option key={c} value={c} className="bg-[#0A0A0A] text-white">{c}</option>
                            ))}
                        </select>
                        <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-black font-semibold mt-2 hover:bg-zinc-200 transition-colors">
                            Add Transaction
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          // CHANGED: Subtle Emerald Gradient
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/[0.05] to-transparent border border-emerald-500/10 relative overflow-hidden"
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Total Income</p>
            </div>
            <p className="text-3xl mb-1 font-medium text-white">₹{(totalIncome / 1000).toFixed(0)}k</p>
            <p className="text-xs text-emerald-500">
              {displayTransactions.filter(t => t.type === "income").length}{" "}
              transactions
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          // CHANGED: Subtle Rose Gradient
          className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/[0.05] to-transparent border border-rose-500/10 relative overflow-hidden"
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Total Expense</p>
            </div>
            <p className="text-3xl mb-1 font-medium text-white">
              ₹{(totalExpense / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-rose-500">
              {displayTransactions.filter(t => t.type === "expense").length}{" "}
              transactions
            </p>
          </div>
        </motion.div>
      </div>

      {/* Transaction List with Flow Animation */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {filteredTransactions.map((transaction, index) => {
          const color = getCategoryColor(transaction.category)
          const isIncome = transaction.type === "income"

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: isIncome ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              // CHANGED: Clean Matte List Item
              className="relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group overflow-hidden"
            >
              {/* Animated Background Gradient - Subtle */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, ${color}08, transparent)` // 08 = very low opacity
                }}
              />

              {/* Flow Animation - Thin Line */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-full opacity-60"
                style={{ backgroundColor: color }}
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: 0.9 + index * 0.05, duration: 0.5 }}
              />

              <div className="relative flex items-center gap-4 pl-2">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${color}15`, // 15% opacity
                    color: color
                  }}
                >
                  {isIncome ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {isIncome ? transaction.from : transaction.to}
                    </p>
                    <div
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-white/5"
                      style={{
                        backgroundColor: `${color}10`,
                        color: color
                      }}
                    >
                      {transaction.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{transaction.from}</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-zinc-700"
                    >
                      →
                    </motion.div>
                    <span>{transaction.to}</span>
                  </div>
                </div>

                {/* Amount and Time */}
                <div className="text-right">
                  <p
                    className={`text-base font-medium mb-0.5 ${
                      isIncome ? "text-emerald-500" : "text-white"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {Number(transaction.amount).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[10px] text-zinc-500">
                      {transaction.time}
                    </span>
                    {transaction.status === "pending" && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
export default TransactionFlow;