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

// Updated Palette: Professional & Muted
const IMPACT_COLORS = {
  High: "#f43f5e",   // Rose-500
  Medium: "#f59e0b", // Amber-500
  Low: "#3b82f6"     // Blue-500
}

// --- SUB-COMPONENTS DEFINED OUTSIDE ---

const InsightsList = ({ insights, selectedInsight, onSelect, isMobile }) => (
  <div className="h-full col-span-12 lg:col-span-4">
    <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] h-full flex flex-col shadow-sm">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white">AI Insights</h3>
          <p className="text-xs text-zinc-500">
            Personalized recommendations
          </p>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {insights.map((item, index) => {
          const ItemIcon = item.icon
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
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/5"
                >
                  <ItemIcon
                    className="w-5 h-5"
                    style={{ color: item.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm mb-1.5 truncate font-medium ${isSelected ? "text-white" : "text-zinc-300"}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                      style={{
                        backgroundColor: `${IMPACT_COLORS[item.impact]}15`, // 15% opacity
                        color: IMPACT_COLORS[item.impact]
                      }}
                    >
                      {item.impact}
                    </span>
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

const InsightDetail = ({ insight, onDismiss, isMobile }) => (
  <motion.div
    key={insight.id} 
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    transition={{ duration: 0.3 }}
    className={`bg-[#050505] lg:bg-transparent ${isMobile ? 'fixed inset-0 z-[60] overflow-y-auto' : 'h-full flex flex-col'}`}
  >
    <div className={`p-6 lg:p-10 rounded-3xl bg-[#0A0A0A] border border-white/[0.06] relative overflow-hidden flex-1 ${isMobile ? 'min-h-full' : ''}`}>
      
      {/* Mobile Header with Back Button */}
      {isMobile && (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/[0.06]">
          <button onClick={onDismiss} className="p-2 bg-white/5 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-lg font-medium text-white">Insight Details</span>
        </div>
      )}

      {/* Subtle Ambient Background (No longer heavy gradients) */}
      <motion.div
        animate={{
          background: [
            `radial-gradient(circle at 0% 0%, ${insight.color}08, transparent 60%)`, // 08 = very low opacity
            `radial-gradient(circle at 100% 100%, ${insight.color}08, transparent 60%)`,
            `radial-gradient(circle at 0% 0%, ${insight.color}08, transparent 60%)`
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative">
        {/* Content Header */}
        <div className="flex flex-col md:flex-row items-start gap-5 mb-10">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/[0.03] border border-white/[0.05]"
          >
            <insight.icon className="w-7 h-7" style={{ color: insight.color }} />
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl mb-3 leading-tight font-medium text-white">{insight.title}</h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">{insight.description}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Impact Level</p>
            <p className="text-xl md:text-2xl mb-3 font-medium" style={{ color: IMPACT_COLORS[insight.impact] }}>
              {insight.impact}
            </p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: insight.impact === "High" ? "100%" : insight.impact === "Medium" ? "66%" : "33%",
                  backgroundColor: IMPACT_COLORS[insight.impact] 
                }} 
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Potential Benefit</p>
            <p className="text-xl md:text-2xl text-white font-medium">{insight.potential}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">AI Confidence</p>
            <div className="flex items-center gap-3">
              <p className="text-xl md:text-2xl text-emerald-400 font-medium">{insight.confidence}%</p>
              <div className="flex-1">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500" 
                    style={{ width: `${insight.confidence}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Box - Cleaner Look */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] mb-8">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-400 font-medium mb-2">AI Recommendation</p>
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
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

        {/* Actions - Premium Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 px-6 py-3.5 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Zap className="w-4 h-4 fill-current" />
            <span>{insight.action}</span>
          </button>
          <div className="flex gap-3">
            <button className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 transition-colors text-white font-medium">
              Learn More
            </button>
            <button 
              onClick={onDismiss}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 transition-colors text-zinc-500 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Generated today</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Based on 847 data points</span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <XCircle className="w-4 h-4 text-zinc-600 hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

// --- MAIN COMPONENT ---

const SmartInsights = () => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(0)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Refined Color Palette for Data
  // Replacing Neon Hexes with Premium Tones
  const insights = [
    {
      id: 1,
      type: "opportunity",
      icon: Lightbulb,
      color: "#f59e0b", // Amber-500 (Gold)
      title: "High-Yield Savings Opportunity",
      description:
        "You have ₹85,000 sitting idle in your savings account earning just 3.5% interest.",
      impact: "High",
      potential: "+₹12,500/year",
      recommendation:
        "Move ₹50,000 to a high-yield fixed deposit earning 7.5% or invest in debt mutual funds for potentially higher returns.",
      confidence: 94,
      action: "Optimize Now",
      tags: ["Savings", "Investment", "Returns"]
    },
    {
      id: 2,
      type: "warning",
      icon: AlertTriangle,
      color: "#f43f5e", // Rose-500 (Alert)
      title: "Subscription Overlap Detected",
      description:
        "You're paying for 3 music streaming services: Spotify, Apple Music, and YouTube Premium.",
      impact: "Medium",
      potential: "₹5,400/year savings",
      recommendation:
        "Cancel 2 services and keep only YouTube Premium for music + video content.",
      confidence: 98,
      action: "Review Subscriptions",
      tags: ["Expenses", "Optimization", "Recurring"]
    },
    {
      id: 3,
      type: "goal",
      icon: Target,
      color: "#3b82f6", // Blue-500 (Goal/Trust)
      title: "Wedding Goal Acceleration",
      description:
        "At your current savings rate, you'll reach your ₹20L wedding goal in 18 months.",
      impact: "High",
      potential: "Achieve 6 months earlier",
      recommendation:
        "Increase monthly SIP by ₹8,000 and reduce dining expenses by ₹5,000 to reach your goal by March 2025.",
      confidence: 87,
      action: "Auto-Optimize",
      tags: ["Goals", "Savings", "Timeline"]
    },
    {
      id: 4,
      type: "tax",
      icon: Shield,
      color: "#8b5cf6", // Violet-500 (Legal/Tax)
      title: "Tax Saving Opportunity",
      description:
        "You can save ₹46,800 in taxes by maximizing your 80C deduction limit.",
      impact: "High",
      potential: "₹46,800 tax savings",
      recommendation:
        "Invest ₹1,50,000 in ELSS funds before March 31st. You've only utilized ₹80,000 of your ₹1.5L limit.",
      confidence: 96,
      action: "Plan Tax Savings",
      tags: ["Tax", "Investment", "Deadline"]
    },
    {
      id: 5,
      type: "spending",
      icon: DollarSign,
      color: "#f59e0b", // Amber (Spending Caution)
      title: "Weekend Spending Spike",
      description:
        "Your weekend spending is 68% higher than weekdays, averaging ₹8,200 per weekend.",
      impact: "Medium",
      potential: "₹15,600/month savings",
      recommendation:
        "Set weekend budget alerts and plan activities in advance. Consider free alternatives for entertainment.",
      confidence: 91,
      action: "Set Budget Alert",
      tags: ["Spending", "Habits", "Behavioral"]
    },
    {
      id: 6,
      type: "investment",
      icon: TrendingUp,
      color: "#10b981", // Emerald (Investment/Growth)
      title: "Portfolio Rebalancing Required",
      description:
        "Your equity allocation has grown to 52% due to market gains. Recommended: 45%.",
      impact: "Medium",
      potential: "Reduce risk by 15%",
      recommendation:
        "Book partial profits from equity and reallocate to debt funds to maintain optimal risk-return balance.",
      confidence: 89,
      action: "Rebalance Portfolio",
      tags: ["Investment", "Risk", "Portfolio"]
    }
  ]

  const handleInsightClick = (index) => {
    setSelectedInsightIndex(index)
    if (isMobile) setIsMobileDetailOpen(true)
  }

  const handleDismiss = () => {
    if (isMobile) {
      setIsMobileDetailOpen(false);
    }
  }

  const currentInsight = insights[selectedInsightIndex]

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-8 h-full">
      {/* List Column */}
      <InsightsList 
        insights={insights} 
        selectedInsight={selectedInsightIndex} 
        onSelect={handleInsightClick} 
        isMobile={isMobile} 
      />
      
      {/* Detail Column - Desktop Only */}
      <div className="hidden lg:block lg:col-span-8 h-full">
        <AnimatePresence mode="wait">
          <InsightDetail 
            key="desktop-detail"
            insight={currentInsight} 
            onDismiss={() => {}} 
            isMobile={false} 
          />
        </AnimatePresence>
      </div>

      {/* Mobile Detail Overlay */}
      <AnimatePresence>
        {isMobile && isMobileDetailOpen && (
           <InsightDetail 
             key="mobile-detail"
             insight={currentInsight} 
             onDismiss={handleDismiss} 
             isMobile={true} 
           />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SmartInsights;