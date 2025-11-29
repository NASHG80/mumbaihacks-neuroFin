import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Shield,
  ArrowLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"

// Color palette
const IMPACT_COLORS = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#3b82f6"
}

// Icon mapper for backend
const ICON_MAP = {
  Lightbulb,
  AlertTriangle,
  Target,
  Shield,
  DollarSign,
  TrendingUp
}

// ---------------------------
// LIST UI
// ---------------------------
const InsightsList = ({ insights, selectedInsight, onSelect, isMobile }) => (
  <div className="h-full col-span-12 lg:col-span-4">
    <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] h-full flex flex-col shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white">AI Insights</h3>
          <p className="text-xs text-zinc-500">Personalized recommendations</p>
        </div>
      </div>

      {/* Scrollable insights */}
      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {insights.map((item, index) => {
          const ItemIcon = ICON_MAP[item.icon] || Lightbulb
          const isSelected = selectedInsight === index && !isMobile

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(index)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? "bg-white/[0.06] border-white/10"
                  : "bg-transparent border-transparent hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/5">
                  <ItemIcon className="w-5 h-5" style={{ color: item.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm mb-1.5 truncate font-medium ${
                    isSelected ? "text-white" : "text-zinc-300"
                  }`}>
                    {item.title}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Impact chip */}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                      style={{
                        backgroundColor: `${IMPACT_COLORS[item.impact]}15`,
                        color: IMPACT_COLORS[item.impact]
                      }}
                    >
                      {item.impact}
                    </span>

                    {/* Confidence */}
                    <span className="text-[10px] text-zinc-500">
                      {item.confidence}% match
                    </span>
                  </div>
                </div>

                {isMobile && <ChevronRight className="w-5 h-5 text-zinc-600" />}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  </div>
)

// ---------------------------
// DETAIL UI
// ---------------------------
const InsightDetail = ({ insight, onDismiss, isMobile }) => {
  const Icon = ICON_MAP[insight.icon] || Lightbulb

  return (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#050505] lg:bg-transparent ${
        isMobile ? "fixed inset-0 z-[60] overflow-y-auto" : "h-full flex flex-col"
      }`}
    >
      <div className={`p-6 lg:p-10 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] relative overflow-hidden flex-1 ${
        isMobile ? "min-h-full" : ""
      }`}>

        {/* Mobile back */}
        {isMobile && (
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <button onClick={onDismiss} className="p-2 bg-white/5 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-lg font-medium text-white">Insight Details</span>
          </div>
        )}

        {/* Animated background */}
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 0% 0%, ${insight.color}08, transparent 60%)`,
              `radial-gradient(circle at 100% 100%, ${insight.color}08, transparent 60%)`,
              `radial-gradient(circle at 0% 0%, ${insight.color}08, transparent 60%)`
            ]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* CONTENT */}
        <div className="relative">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05]">
              <Icon className="w-7 h-7" style={{ color: insight.color }} />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl mb-3 leading-tight font-medium text-white">
                {insight.title}
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>

          {/* --- METRICS GRID (IMPACT + CONFIDENCE VISIBLE) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

            {/* Impact */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-zinc-500 uppercase mb-3">Impact Level</p>
              <p className="text-xl mb-3 font-medium" style={{ color: IMPACT_COLORS[insight.impact] }}>
                {insight.impact}
              </p>

              {/* Impact Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      insight.impact === "High" ? "100%" :
                      insight.impact === "Medium" ? "66%" : "33%",
                    backgroundColor: IMPACT_COLORS[insight.impact]
                  }}
                />
              </div>
            </div>

            {/* Potential */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-zinc-500 uppercase mb-3">Potential Benefit</p>
              <p className="text-xl text-white font-medium">{insight.potential}</p>
            </div>

            {/* Confidence */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-zinc-500 uppercase mb-3">AI Confidence</p>
              <div className="flex items-center gap-3">
                <p className="text-xl text-emerald-400 font-medium">
                  {insight.confidence}%
                </p>

                <div className="flex-1">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] mb-8">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-400 font-medium mb-2">
                  AI Recommendation
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {insight.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------
// MAIN COMPONENT
// ---------------------------
const SmartInsights = () => {
  const [insights, setInsights] = useState([])
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(0)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)

  // Resize detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch insights from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:7001/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "sandbox" })
        })

        const data = await res.json()
        console.log("Loaded Insights:", data)

        if (data.insights) {
          setInsights(data.insights)
        }
      } catch (err) {
        console.error("Insights fetch failed:", err)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading)
    return <div className="text-center text-zinc-500 p-6">Loading insights...</div>

  if (!insights.length)
    return <div className="text-center text-red-500 p-6">No insights available.</div>

  const currentInsight = insights[selectedInsightIndex]

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-8 h-full">

      {/* List */}
      <InsightsList
        insights={insights}
        selectedInsight={selectedInsightIndex}
        onSelect={(i) => {
          setSelectedInsightIndex(i)
          if (isMobile) setIsMobileDetailOpen(true)
        }}
        isMobile={isMobile}
      />

      {/* Desktop detail */}
      <div className="hidden lg:block lg:col-span-8 h-full">
        <AnimatePresence mode="wait">
          <InsightDetail
            insight={currentInsight}
            onDismiss={() => {}}
            isMobile={false}
          />
        </AnimatePresence>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isMobileDetailOpen && (
          <InsightDetail
            insight={currentInsight}
            onDismiss={() => setIsMobileDetailOpen(false)}
            isMobile={true}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SmartInsights
