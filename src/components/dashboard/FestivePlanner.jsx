import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  TrendingUp,
  Palette,
  PartyPopper,
  Gift,
  Users,
  Home as HomeIcon,
  Sparkles,
  Plus,
  X,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import CustomDatePicker from "../CustomDatePicker"

const FestivePlanner = () => {
  const [selectedFestival, setSelectedFestival] = useState(0)
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  // Form Data
  const [newFestival, setNewFestival] = useState({
    name: "",
    date: null,
    estimatedSpend: "",
    categories: [{ name: "", amount: "", icon: "Gift" }],
    color: "#f59e0b",
    icon: "PartyPopper"
  })

  const [adjustData, setAdjustData] = useState({
    estimatedSpend: "",
    categories: []
  })

  const [saveAmount, setSaveAmount] = useState("")

  const token = localStorage.getItem("nf_token")
  const API_URL = "http://localhost:5000/api/festivals"

  const iconMap = {
    Gift,
    Users,
    HomeIcon,
    Sparkles,
    TrendingUp,
    Palette,
    PartyPopper,
    Calendar
  }

  useEffect(() => {
    fetchFestivals()
  }, [])

  const fetchFestivals = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch festivals")
      const data = await res.json()
      console.log("All Festival Data:", data)
      setFestivals(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load festivals")
    } finally {
      setLoading(false)
    }
  }

  const handleAddFestival = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newFestival,
          date: newFestival.date ? newFestival.date.toISOString() : null
        })
      })
      if (!res.ok) throw new Error("Failed to create festival")
      const data = await res.json()
      setFestivals([...festivals, data])
      setShowAddModal(false)
      setNewFestival({
        name: "",
        date: null,
        estimatedSpend: "",
        categories: [{ name: "", amount: "", icon: "Gift" }],
        color: "#f59e0b",
        icon: "PartyPopper"
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdjustBudget = async (e) => {
    e.preventDefault()
    const festival = festivals[selectedFestival]
    try {
      const res = await fetch(`${API_URL}/${festival._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(adjustData)
      })
      if (!res.ok) throw new Error("Failed to update festival")
      const data = await res.json()
      const updatedFestivals = [...festivals]
      updatedFestivals[selectedFestival] = data
      setFestivals(updatedFestivals)
      setShowAdjustModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveMore = async (e) => {
    e.preventDefault()
    const festival = festivals[selectedFestival]
    try {
      const res = await fetch(`${API_URL}/${festival._id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: saveAmount })
      })
      if (!res.ok) throw new Error("Failed to save amount")
      const data = await res.json()
      const updatedFestivals = [...festivals]
      updatedFestivals[selectedFestival] = data
      setFestivals(updatedFestivals)
      setShowSaveModal(false)
      setSaveAmount("")
    } catch (err) {
      console.error(err)
    }
  }

  // Helper to calculate days left
  const getDaysLeft = (dateString) => {
    const diff = new Date(dateString) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) return <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] flex justify-center"><Loader2 className="animate-spin text-white" /></div>

  const festival = festivals[selectedFestival]
  const savingsProgress = festival ? Math.min(100, Math.round((festival.savedAmount / festival.estimatedSpend) * 100)) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Festive Planner</h3>
          <p className="text-zinc-500 text-sm">
            Smart budgeting for {festivals.length} celebrations
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          {/* <Calendar className="w-6 h-6 text-zinc-400" /> */}
        </div>
      </div>

      {festivals.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">
          <p>No festivals planned yet.</p>
          <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-white text-black rounded-xl font-medium">Add Festival</button>
        </div>
      ) : (
        <>
          {/* Festival Selector */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {festivals.map((fest, index) => {
              const FestivalIcon = iconMap[fest.icon] || PartyPopper
              return (
                <motion.button
                  key={fest._id || index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFestival(index)}
                  className={`flex-1 min-w-[120px] p-4 rounded-xl transition-all border ${selectedFestival === index
                    ? "bg-white/[0.08] border-white/10"
                    : "bg-transparent border-white/[0.05] hover:bg-white/[0.02]"
                    }`}
                >
                  <div className="text-2xl mb-2">
                    <FestivalIcon className="w-6 h-6 mx-auto" style={{ color: fest.color }} />
                  </div>
                  <p className={`text-xs font-medium truncate w-full text-center ${selectedFestival === index ? "text-white" : "text-zinc-500"}`}>
                    {fest.name}
                  </p>
                </motion.button>
              )
            })}
          </div>

          {/* Festival Details */}
          {festival && (
            <motion.div
              key={festival._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-2xl font-medium text-white mb-1">{festival.name}</p>
                  <p className="text-zinc-500 text-sm">{new Date(festival.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Days Left</p>
                  <p className="text-2xl font-medium" style={{ color: festival.color }}>
                    {getDaysLeft(festival.date)}
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
                  ₹{festival.savedAmount.toLocaleString("en-IN")} saved
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Allocations</p>
                {festival.categories.map((category, index) => {
                  const Icon = iconMap[category.icon] || Sparkles
                  return (
                    <motion.div
                      key={index}
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
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setAdjustData({
                  estimatedSpend: festival.estimatedSpend,
                  categories: festival.categories
                })
                setShowAdjustModal(true)
              }}
              className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Adjust Budget
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="p-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Save More
            </button>
          </div>
        </>
      )}

      {/* Add Festival Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-white">Add Festival</h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleAddFestival} className="space-y-4">
                <input
                  type="text" placeholder="Festival Name" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/20"
                  value={newFestival.name} onChange={e => setNewFestival({ ...newFestival, name: e.target.value })}
                />
                <CustomDatePicker
                  selected={newFestival.date}
                  onChange={(date) => setNewFestival({ ...newFestival, date })}
                  placeholderText="Select festival date"
                  minDate={new Date()}
                  accentColor="emerald"
                />
                <input
                  type="number" placeholder="Estimated Spend" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/20"
                  value={newFestival.estimatedSpend} onChange={e => setNewFestival({ ...newFestival, estimatedSpend: e.target.value })}
                />
                {/* Simplified categories for MVP */}
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Categories</p>
                  {newFestival.categories.map((cat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text" placeholder="Name"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        value={cat.name}
                        onChange={e => {
                          const newCats = [...newFestival.categories];
                          newCats[idx].name = e.target.value;
                          setNewFestival({ ...newFestival, categories: newCats });
                        }}
                      />
                      <input
                        type="number" placeholder="Amount"
                        className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        value={cat.amount}
                        onChange={e => {
                          const newCats = [...newFestival.categories];
                          newCats[idx].amount = e.target.value;
                          setNewFestival({ ...newFestival, categories: newCats });
                        }}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => setNewFestival({ ...newFestival, categories: [...newFestival.categories, { name: "", amount: "", icon: "Gift" }] })} className="text-xs text-blue-400 hover:text-blue-300">
                    + Add Category
                  </button>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200">Add Festival</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adjust Budget Modal */}
      <AnimatePresence>
        {showAdjustModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-white">Adjust Budget</h3>
                <button onClick={() => setShowAdjustModal(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleAdjustBudget} className="space-y-4">
                <input
                  type="number" placeholder="Total Estimated Spend" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/20"
                  value={adjustData.estimatedSpend} onChange={e => setAdjustData({ ...adjustData, estimatedSpend: e.target.value })}
                />
                <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200">Update Budget</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save More Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-white">Save More</h3>
                <button onClick={() => setShowSaveModal(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleSaveMore} className="space-y-4">
                <input
                  type="number" placeholder="Amount to Save" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/20"
                  value={saveAmount} onChange={e => setSaveAmount(e.target.value)}
                />
                <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200">Add Savings</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
export default FestivePlanner;