import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, Shield, TrendingUp, Tv, Music, Zap, ChevronRight, ArrowUpRight, Plus, Box, BrainCircuit, X
} from "lucide-react"
import { useState } from "react"
import { createPortal } from "react-dom"

const SubscriptionTracker = ({ subscriptions = [], onAddSubscription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', category: 'Entertainment', amount: '', date: '', icon: 'Tv' });

  const displaySubs = subscriptions || [];
  const totalUpcoming = displaySubs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  const categories = displaySubs.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + (Number(curr.amount) || 0);
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(categories).sort(([, a], [, b]) => b - a).slice(0, 3); 

  const themeStyles = {
    blue: { icon: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", gradient: "from-blue-500/20 to-blue-500/5", bar: "bg-blue-500" },
    emerald: { icon: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "from-emerald-500/20 to-emerald-500/5", bar: "bg-emerald-500" },
    rose: { icon: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", gradient: "from-rose-500/20 to-rose-500/5", bar: "bg-rose-500" },
    amber: { icon: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", gradient: "from-amber-500/20 to-amber-500/5", bar: "bg-amber-500" }
  }

  const getCategoryColor = (cat) => {
    if (cat === 'Insurance') return themeStyles.blue.bar;
    if (cat === 'Investment') return themeStyles.emerald.bar;
    if (cat === 'Entertainment' || cat === 'AI Tools') return themeStyles.rose.bar;
    return themeStyles.amber.bar;
  }

  const getIcon = (sub) => {
      if (typeof sub.icon !== 'string') return sub.icon || Zap;
      const icons = { Tv, Music, Shield, TrendingUp, Zap, Box, BrainCircuit };
      return icons[sub.icon] || Zap;
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      if(onAddSubscription) {
          const iconName = newSub.category === 'Investment' ? 'TrendingUp' : newSub.category === 'Insurance' ? 'Shield' : 'Tv';
          const theme = newSub.category === 'Investment' ? 'emerald' : newSub.category === 'Insurance' ? 'blue' : 'rose';
          
          onAddSubscription({
              id: Date.now(),
              ...newSub,
              amount: Number(newSub.amount),
              theme,
              icon: iconName, // Send String for backend
              dueDate: newSub.date // Raw date for backend
          });
      }
      setIsModalOpen(false);
      setNewSub({ name: '', category: 'Entertainment', amount: '', date: '', icon: 'Tv' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col w-full p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] relative overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 z-10 flex-shrink-0">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Upcoming Payments</h3>
          <p className="text-sm text-zinc-500">SIPs, Renewals & Subscriptions</p>
        </div>
        <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] transition-colors group">
          <Calendar className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Total Summary Card */}
      <div className="relative mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden group flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase mb-1">Total Next 30 Days</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium text-white">
                ₹{totalUpcoming.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
            View Calendar <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-1 min-h-[200px]">
        {displaySubs.map((sub, index) => {
          const styles = themeStyles[sub.theme || 'blue']
          const Icon = getIcon(sub);
          const isUrgent = sub.displayDate === "Due Tomorrow"

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group relative p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] cursor-pointer border border-transparent hover:border-white/[0.04]"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${styles.gradient} border border-white/[0.05] group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-black/20`}>
                    <Icon className={`w-5 h-5 ${styles.icon}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {sub.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-zinc-500">{sub.category}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-zinc-600" />
                      <span className={`text-[11px] font-medium ${isUrgent ? "text-amber-500" : "text-zinc-400"}`}>
                        {sub.displayDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white tracking-wide">
                    ₹{Number(sub.amount).toLocaleString('en-IN')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Spend Distribution Section */}
<div className="mt-6">
  <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase mb-2">
    Spend Distribution
  </p>

  {/* Distribution Bar */}
  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
    {sortedCategories.map(([cat, amt], index) => {
      const total = totalUpcoming || 1;
      const width = (amt / total) * 100;
      return (
        <div
          key={index}
          style={{ width: `${width}%` }}
          className={`${getCategoryColor(cat)} transition-all`}
        />
      );
    })}
  </div>

  {/* Labels */}
  <div className="flex justify-between mt-2 text-[11px] text-zinc-500">
    {sortedCategories.map(([cat, amt], index) => {
      const total = totalUpcoming || 1;
      const pct = Math.round((amt / total) * 100);
      return (
        <span key={index} className="text-xs">
          {cat} ({pct}%)
        </span>
      );
    })}
  </div>
</div>


      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex-shrink-0 space-y-4">
        <button onClick={() => setIsModalOpen(true)} className="w-full py-3 rounded-xl border border-dashed border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 text-xs font-medium">
            <Plus className="w-4 h-4" /> Add New Subscription
        </button>
      </div>

      {/* Add Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-medium text-white">Add Subscription</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Name (e.g. Netflix)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} required />
                    <input type="number" placeholder="Amount" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" value={newSub.amount} onChange={e => setNewSub({...newSub, amount: e.target.value})} required />
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" value={newSub.date} onChange={e => setNewSub({...newSub, date: e.target.value})} required />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={newSub.category} onChange={e => setNewSub({...newSub, category: e.target.value})}>
                        <option value="Entertainment" className="bg-black">Entertainment</option>
                        <option value="Insurance" className="bg-black">Insurance</option>
                        <option value="Investment" className="bg-black">Investment</option>
                        <option value="Software" className="bg-black">Software</option>
                    </select>
                    <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-bold">Add Subscription</button>
                </form>
            </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  )
}

export default SubscriptionTracker;