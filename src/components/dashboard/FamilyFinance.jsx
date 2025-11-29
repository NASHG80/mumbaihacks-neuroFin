import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Heart,
  TrendingUp,
  Gift,
  Home,
  GraduationCap,
  Shield,
  ArrowRightLeft,
  Plus,
  ChevronRight,
  Crown,
  Star,
  X,
  Wallet,
  MoreHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
  Target
} from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "../../utils/currencyFormatter"

const FamilyFinance = ({ members = [], onAddMember, transactions = [], onAddTransaction, onUpdateTransaction, onDeleteMember, goals = [], onAddGoal }) => {
  const [selectedMember, setSelectedMember] = useState("priya")
  const [view, setView] = useState("overview")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', role: '', relation: 'Member', color: '#f59e0b' })
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [txForm, setTxForm] = useState({ from: '', to: '', amount: '', type: '', time: '', recurring: false, flow: 'out' })
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: "", target: "", current: "0", color: "#f59e0b" })

  // Fallback if no props passed
  const familyMembers = members.length > 0 ? members : [
    {
      id: "priya",
      name: "Priya Sharma",
      role: "You",
      avatar: "P",
      color: "#3b82f6", // Blue
      contribution: 100000,
      expenses: 53000,
      savings: 47000,
      status: "primary",
      age: 28,
      goals: ["Wedding", "House", "Car"]
    },
    {
      id: "rahul",
      name: "Rahul Sharma",
      role: "Spouse",
      avatar: "R",
      color: "#f59e0b", // Amber (Gold)
      contribution: 95000,
      expenses: 45000,
      savings: 50000,
      status: "contributor",
      age: 30,
      goals: ["House", "Investment", "Vacation"]
    }
  ]

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!onAddMember) return
    onAddMember({
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role || newMember.relation,
      avatar: newMember.name[0].toUpperCase(),
      color: newMember.color,
      contribution: 0,
      expenses: 0,
      savings: 0,
      status: 'member',
      age: 25, // Default
      goals: []
    })
    setIsAddMemberOpen(false)
    setNewMember({ name: '', role: '', relation: 'Member', color: '#3b82f6' })
  }

  const staticSharedGoals = [
    {
      id: 1,
      name: "Family Vacation",
      target: 150000,
      current: 85000,
      contributors: ["priya", "rahul"],
      deadline: "2026-12",
      icon: Target,
      color: "#3b82f6", // Blue
      priority: "high"
    },
    {
      id: 2,
      name: "Wedding Expenses",
      target: 2000000,
      current: 1200000,
      contributors: ["priya", "rahul"],
      deadline: "2025-11",
      icon: Heart,
      color: "#f59e0b", // Amber
      priority: "high"
    },
    {
      id: 3,
      name: "Europe Trip",
      target: 500000,
      current: 150000,
      contributors: ["priya", "rahul"],
      deadline: "2025-08",
      icon: Gift,
      color: "#f43f5e", // Rose
      priority: "medium"
    }
  ]

  const sharedGoals = goals.length > 0
    ? goals.map((g, idx) => ({
      id: g.id || idx,
      name: g.name,
      target: g.target,
      current: g.current,
      // simple mapping: treat all family members as contributors for now
      contributors: familyMembers.map(m => m.name.split(" ")[0]).slice(0, 3),
      deadline: "--",
      icon: Home,
      color: g.color || "#3b82f6",
      priority: "medium"
    }))
    : staticSharedGoals

  const defaultFamilyTransactions = [
    { id: "t1", from: "Priya", to: "Mother", amount: 5000, type: "Sent to Mom", time: "Yesterday", recurring: false, flow: "out" },
    { id: "t2", from: "Rahul", to: "House Fund", amount: 50000, type: "Savings", time: "5h ago", recurring: true, flow: "in" },
    { id: "t3", from: "Priya", to: "Account", amount: 85000, type: "Salary Credit", time: "1st Nov", recurring: true, flow: "in" },
    { id: "t4", from: "Father", to: "Wedding Fund", amount: 13000, type: "Contribution", time: "2d ago", recurring: true, flow: "in" }
  ]

  const familyTransactions = transactions.length > 0 ? transactions : defaultFamilyTransactions

  const selectedMemberData = familyMembers.find(m => m.id === selectedMember) || familyMembers[0]

  // Filter transactions for the selected member to show in the detailed view
  const memberTransactions = familyTransactions.filter(tx => 
    tx.from.toLowerCase().includes(selectedMemberData.name.split(' ')[0].toLowerCase())
  );

  const handleOpenAddTx = () => {
    setEditingTransaction(null)
    setTxForm({
      from: selectedMemberData ? selectedMemberData.name.split(' ')[0] : '',
      to: '',
      amount: '',
      type: '',
      time: '',
      recurring: false,
      flow: 'out'
    })
    setIsTxModalOpen(true)
  }

  const handleOpenEditTx = (tx) => {
    setEditingTransaction(tx)
    setTxForm({
      from: tx.from || '',
      to: tx.to || '',
      amount: tx.amount != null ? String(tx.amount) : '',
      type: tx.type || '',
      time: tx.time || '',
      recurring: !!tx.recurring,
      flow: tx.flow || 'out'
    })
    setIsTxModalOpen(true)
  }

  const handleSubmitTransaction = (e) => {
    e.preventDefault()
    const payload = {
      from: txForm.from,
      to: txForm.to,
      amount: Number(txForm.amount) || 0,
      type: txForm.type,
      time: txForm.time,
      recurring: txForm.recurring,
      flow: txForm.flow
    }

    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({ ...editingTransaction, ...payload })
    } else if (!editingTransaction && onAddTransaction) {
      onAddTransaction({ id: Date.now().toString(), ...payload })
    }

    setIsTxModalOpen(false)
    setEditingTransaction(null)
    setTxForm({ from: '', to: '', amount: '', type: '', time: '', recurring: false, flow: 'out' })
  }

  const handleSubmitGoal = (e) => {
    e.preventDefault()
    if (!onAddGoal) return

    const payload = {
      name: newGoal.name,
      target: Number(newGoal.target) || 0,
      current: Number(newGoal.current) || 0,
      icon: Target,
      color: newGoal.color
    }

    onAddGoal(payload)
    setIsAddGoalOpen(false)
    setNewGoal({ name: "", target: "", current: "0", color: "#3b82f6" })
  }

  const totalFamilyIncome = familyMembers.reduce((sum, m) => sum + m.contribution, 0)
  const totalFamilySavings = familyMembers.reduce((sum, m) => sum + m.savings, 0)
  const familyHealthScore = totalFamilyIncome > 0 ? Math.round((totalFamilySavings / totalFamilyIncome) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-4 lg:p-10 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] relative"
    >
      <div className="relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6 md:gap-0">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              // CHANGED: Rich Gold/Amber Gradient for Logo
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
              <Users className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
            </motion.div>
            <div>
              <h3 className="text-2xl md:text-3xl mb-1 font-medium text-white">Family Hub</h3>
              <p className="text-zinc-500 text-sm">Collective wealth & goals</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center overflow-x-auto no-scrollbar">
            <div className="flex bg-white/[0.03] rounded-xl p-1 shrink-0 border border-white/[0.05]">
                {["overview", "flow", "goals"].map(v => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-all capitalize font-medium ${
                    view === v
                        ? "bg-zinc-800 text-white shadow-sm border border-white/10"
                        : "text-zinc-500 hover:text-white"
                    }`}
                >
                    {v}
                </button>
                ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddMemberOpen(true)}
              className="px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white text-black text-xs md:text-sm flex items-center gap-2 font-medium hover:bg-zinc-200 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> <span className="hidden xs:inline">Add</span>
            </motion.button>
          </div>
        </div>

        {/* Add Member Modal */}
        <AnimatePresence>
          {isAddMemberOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-white">Add Family Member</h3>
                  <button onClick={() => setIsAddMemberOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">Name</label>
                    <input
                        type="text" placeholder="e.g. Mom" required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white placeholder:text-zinc-600"
                        value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">Role</label>
                    <input
                        type="text" placeholder="e.g. Dependent"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white placeholder:text-zinc-600"
                        value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 ml-1">Theme Color</label>
                    <div className="flex gap-3">
                        {['#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e'].map(c => (
                        <div key={c} onClick={() => setNewMember({ ...newMember, color: c })}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all flex items-center justify-center ${newMember.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}>
                            {newMember.color === c && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-4 hover:bg-zinc-200 transition-all">
                    Add Member
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTxModalOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-white">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h3>
                  <button onClick={() => { setIsTxModalOpen(false); setEditingTransaction(null) }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmitTransaction} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">From</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                      value={txForm.from}
                      onChange={e => setTxForm({ ...txForm, from: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">To</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                      value={txForm.to}
                      onChange={e => setTxForm({ ...txForm, to: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">Amount</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                      value={txForm.amount}
                      onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">Label</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                      value={txForm.type}
                      onChange={e => setTxForm({ ...txForm, type: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-zinc-500 ml-1">Flow</label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-sm text-white"
                        value={txForm.flow}
                        onChange={e => setTxForm({ ...txForm, flow: e.target.value })}
                      >
                        <option value="out" className="bg-[#0A0A0A]">Out</option>
                        <option value="in" className="bg-[#0A0A0A]">In</option>
                      </select>
                    </div>
                    <div className="flex-1 flex items-end">
                      <label className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-500"
                          checked={txForm.recurring}
                          onChange={e => setTxForm({ ...txForm, recurring: e.target.checked })}
                        />
                        Recurring
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-4 hover:bg-zinc-200 transition-all">
                    {editingTransaction ? "Save Changes" : "Add Transaction"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddGoalOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-white">Add Goal</h3>
                  <button onClick={() => setIsAddGoalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmitGoal} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">Goal name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                      value={newGoal.name}
                      onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-zinc-500 ml-1">Target (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                        value={newGoal.target}
                        onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-zinc-500 ml-1">Current (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors text-white"
                        value={newGoal.current}
                        onChange={e => setNewGoal({ ...newGoal, current: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 ml-1">Theme Color</label>
                    <div className="flex gap-3">
                      {["#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e"].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewGoal({ ...newGoal, color: c })}
                          className={`w-8 h-8 rounded-full border-2 ${newGoal.color === c ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-4 hover:bg-zinc-200 transition-all">
                    Add Goal
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Family Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
                {/* Stats Cards */}
                <motion.div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="relative">
                    <p className="text-xs md:text-sm text-zinc-500 mb-1 md:mb-2 font-medium">Total Income</p>
                    <p className="text-xl md:text-3xl mb-1 md:mb-2 text-white font-medium">{formatCurrency(totalFamilyIncome)}</p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-emerald-500">
                      <TrendingUp className="w-3 h-3" /> <span>+8.5%</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="relative">
                    <p className="text-xs md:text-sm text-zinc-500 mb-1 md:mb-2 font-medium">Total Savings</p>
                    <p className="text-xl md:text-3xl mb-1 md:mb-2 text-white font-medium">{formatCurrency(totalFamilySavings)}</p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-amber-500">
                      <Star className="w-3 h-3" /> <span>{familyHealthScore}% rate</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="relative">
                    <p className="text-xs md:text-sm text-zinc-500 mb-1 md:mb-2 font-medium">Members</p>
                    <p className="text-xl md:text-3xl mb-1 md:mb-2 text-white font-medium">{familyMembers.length}</p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-zinc-400">
                      <span>{familyMembers.filter(m => m.status === "contributor").length} active</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="relative">
                    <p className="text-xs md:text-sm text-zinc-500 mb-1 md:mb-2 font-medium">Goals</p>
                    <p className="text-xl md:text-3xl mb-1 md:mb-2 text-white font-medium">{sharedGoals.length}</p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-blue-500">
                      <span>{sharedGoals.filter(g => g.priority === "high").length} high prio</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Family Members Grid */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h4 className="text-lg md:text-xl flex items-center gap-2 font-medium text-white">
                    <Crown className="w-5 h-5 text-amber-500" /> Family Members
                  </h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {familyMembers.map((member, index) => {
                    const isSelected = selectedMember === member.id
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => setSelectedMember(member.id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden border ${isSelected ? "bg-white/[0.06] border-white/10" : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"}`}
                      >
                        {member.status === "primary" && (
                          <div className="absolute top-3 right-3"><Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /></div>
                        )}
                        {onDeleteMember && member.status !== "primary" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteMember(member) }}
                            className="absolute top-3 right-3 p-1 rounded-full bg-black/40 hover:bg-black/70 text-zinc-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        {/* CHANGED: Premium Gradient for Member Logo */}
                        <div 
                          className="w-12 h-12 md:w-16 md:h-16 rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center text-xl md:text-2xl font-bold text-white border border-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${member.color}40, ${member.color}10)`,
                            boxShadow: `0 0 20px ${member.color}20`
                          }}
                        >
                          {member.avatar}
                        </div>
                        <div className="text-center mb-3 md:mb-4">
                          <p className="text-xs md:text-sm mb-0.5 truncate font-medium text-white">{member.name}</p>
                          <p className="text-[10px] md:text-xs text-zinc-500">{member.role}</p>
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                          <div className="flex justify-between text-[10px] md:text-xs">
                            <span className="text-zinc-500">Income</span>
                            <span style={{ color: member.color }}>{formatCurrency(member.contribution)}</span>
                          </div>
                          <div className="flex justify-between text-[10px] md:text-xs">
                            <span className="text-zinc-500">Savings</span>
                            <span className="text-blue-400">{formatCurrency(member.savings)}</span>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-4 h-1 md:h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${member.contribution > 0 ? (member.savings / member.contribution) * 100 : 0}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: member.color }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                  
                  {/* Add Member Card (Shortcut) */}
                  <motion.div
                    onClick={() => setIsAddMemberOpen(true)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-2xl cursor-pointer border border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-2 md:gap-3 min-h-[160px] md:min-h-[200px] group bg-white/[0.01]"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 group-hover:text-white" />
                    </div>
                    <span className="text-xs md:text-sm text-zinc-500 group-hover:text-white transition-colors text-center">Add Member</span>
                  </motion.div>
                </div>
              </div>

              {/* Detailed View Panel */}
              <motion.div
                key={selectedMember}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 md:p-8 rounded-2xl bg-[#0A0A0A] border border-white/[0.06] mb-10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    {/* CHANGED: Premium Gradient for Selected Member Logo */}
                    <div 
                      className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold text-white border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${selectedMemberData.color}40, ${selectedMemberData.color}10)`,
                        boxShadow: `0 0 25px ${selectedMemberData.color}30`
                      }}
                    >
                      {selectedMemberData.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl mb-1 font-medium text-white">{selectedMemberData.name}</h4>
                      <p className="text-xs md:text-sm text-zinc-500">{selectedMemberData.role} • {selectedMemberData.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm hover:bg-white/10 flex items-center justify-center gap-2 text-zinc-300">
                        <Wallet className="w-3 h-3 md:w-4 md:h-4" /> Set Budget
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white text-black text-xs md:text-sm font-medium hover:bg-zinc-200 transition-colors">
                        View Analytics
                    </button>
                  </div>
                </div>
                
                {/* Recent Activity for Selected Member */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <h5 className="text-sm text-zinc-400 mb-4">Recent Transactions</h5>
                    <div className="space-y-3">
                        {memberTransactions.length > 0 ? memberTransactions.map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.flow === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {tx.flow === 'in' ? <Wallet className="w-4 h-4"/> : <ArrowRightLeft className="w-4 h-4"/>}
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-zinc-300">{tx.type}</p>
                                        <p className="text-[10px] md:text-xs text-zinc-500">{tx.time}</p>
                                    </div>
                                </div>
                                <p className={`text-xs md:text-sm font-medium ${tx.flow === 'in' ? 'text-emerald-500' : 'text-white'}`}>
                                    {tx.flow === 'in' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                </p>
                            </div>
                        )) : (
                            <p className="text-xs text-zinc-600 italic">No recent activity for {selectedMemberData.name}</p>
                        )}
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {view === "flow" && (
             <motion.div
              key="flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
                <div className="mb-8">
                   <h4 className="text-xl mb-6 flex items-center justify-between text-white font-medium">
                      <span className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                        Family Money Flow
                      </span>
                      {onAddTransaction && (
                        <button
                          onClick={handleOpenAddTx}
                          className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white/80 hover:bg-white/15"
                        >
                          <Plus className="w-3 h-3 inline-block mr-1" /> Add
                        </button>
                      )}
                   </h4>
                   <div className="space-y-4">
                      {familyTransactions.map((tx, index) => {
                         const member = familyMembers.find(m => m.name.includes(tx.from)) || familyMembers[0];
                          const color = member.color || "#3b82f6";
                          return (
                            <div key={index} className="relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border border-white/5" style={{ background: `${color}10`, color: color }}>
                                    {tx.flow === "in" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                  </div>
                                  <div>
                                     <p className="text-sm text-zinc-300">{tx.from} <span className="text-zinc-600 text-xs">to</span> {tx.to}</p>
                                     <p className="text-xs text-zinc-500">{tx.time} • {tx.type}</p>
                                  </div>
                               </div>
                               <div className="text-right flex flex-col items-end gap-1">
                                  <p className={`font-medium ${tx.flow === "in" ? "text-emerald-500" : "text-white"}`}>
                                    {tx.flow === "in" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                                  </p>
                                  {tx.recurring && <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">Recurring</span>}
                                  {onUpdateTransaction && (
                                    <button
                                      onClick={() => handleOpenEditTx(tx)}
                                      className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-zinc-500 hover:text-white"
                                    >
                                      <MoreHorizontal className="w-3 h-3" />
                                    </button>
                                  )}
                               </div>
                            </div>
                         )
                      })}
                   </div>
                </div>
             </motion.div>
          )}
          
          {view === "goals" && (
             <motion.div
               key="goals"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
             >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {sharedGoals.map((goal, index) => {
                      const progress = (goal.current / goal.target) * 100;
                      const Icon = goal.icon;
                      return (
                         <div key={index} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/[0.06] relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white border border-white/5">
                                     <Icon className="w-5 h-5" style={{color: goal.color}} />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-medium text-white">{goal.name}</h4>
                                     <p className="text-xs text-zinc-500">Target: {formatCurrency(goal.target)}</p>
                                  </div>
                               </div>
                               <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-400">{goal.priority}</span>
                            </div>
                            
                            <div className="mb-2 flex justify-between text-xs">
                               <span className="text-zinc-500">Progress</span>
                               <span style={{color: goal.color}}>{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
                               <div className="h-full rounded-full" style={{width: `${progress}%`, background: goal.color}} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                               <div className="flex -space-x-2">
                                  {goal.contributors.map((c, i) => (
                                     <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[10px] text-zinc-400">
                                        {c[0]}
                                     </div>
                                  ))}
                               </div>
                               <p className="text-xs text-zinc-500">By {goal.deadline}</p>
                            </div>
                         </div>
                      )
                   })}
                   
                   {/* Add Goal Card */}
                   <div
                     className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-white hover:border-white/20 cursor-pointer transition-all min-h-[180px]"
                     onClick={() => onAddGoal && setIsAddGoalOpen(true)}
                   >
                      <Plus className="w-8 h-8" />
                      <span className="text-sm">Add New Goal</span>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default FamilyFinance;