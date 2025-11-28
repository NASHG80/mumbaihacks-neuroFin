import { motion, AnimatePresence } from "framer-motion";
import FinancialHealthScore from "../components/dashboard/FinancialHealthScore";
import SmartAccounts from "../components/dashboard/SmartAccounts";
import SpendingGraph from "../components/dashboard/SpendingGraph";
import FestivePlanner from "../components/dashboard/FestivePlanner";
import FinancialChallenges from "../components/dashboard/FinancialChallenges";
import FuturePlanning from "../components/dashboard/FuturePlanning";
import AutomationsHub from "../components/dashboard/AutomationsHub";
import NotificationsFeed from "../components/dashboard/NotificationsFeed";
import GoalsSection from "../components/dashboard/GoalsSection";
import CashFlowAnalysis from "../components/dashboard/CashFlowAnalysis";
import InvestmentPortfolio from "../components/dashboard/InvestmentPortfolio";
import SpendingHeatmap from "../components/dashboard/SpendingHeatmap";
import TransactionFlow from "../components/dashboard/TransactionFlow";
import SmartInsights from "../components/dashboard/SmartInsights";
import VoiceOfMoney from "../components/dashboard/VoiceOfMoney";
import FamilyFinance from "../components/dashboard/FamilyFinance";
import SubscriptionTracker from "../components/dashboard/SubscriptionTracker";
import UserCard from "../components/dashboard/UserCard";


import {
  Sparkles,
  Bell,
  Settings,
  TrendingUp,
  BarChart3,
  Wallet,
  Zap,
  Activity,
  Download,
  Users,
  Brain,
  X,
  LogOut,
  MessageSquareText
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function DashboardPage() {

  const navigate = useNavigate();
  const containerRef = useRef(null);

  // -------------------------------------------------
  // GLOBAL STATE
  // -------------------------------------------------
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState("overview");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [userData, setUserData] = useState({ name: "User", email: "" });

  const [netWorth, setNetWorth] = useState(4664900);
  const [monthlyGrowth, setMonthlyGrowth] = useState(51300);
  const [activeGoalsCount, setActiveGoalsCount] = useState(0);

  const [transactions, setTransactions] = useState([]);

  const [goals, setGoals] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyTransactions, setFamilyTransactions] = useState([]);

  const [subscriptions, setSubscriptions] = useState([]);
  const [userCard, setUserCard] = useState(null);
  


  // -------------------------------------------------
  // SUBSCRIPTIONS HELPER
  // -------------------------------------------------
  const formatSubscriptionData = (sub) => {
    const dateObj = new Date(sub.dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      ...sub,
      id: sub._id || sub.id,
      displayDate:
        dateObj.toDateString() === tomorrow.toDateString()
          ? "Due Tomorrow"
          : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      icon: sub.icon || "Zap",
    };
  };

  // -------------------------------------------------
  // FETCH SUBSCRIPTIONS
  // -------------------------------------------------
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("nf_token");
      if (!token) return;

      try {
        const res = await fetch("/api/subscriptions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.map(formatSubscriptionData));
        }
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      }
    };

    fetchSubscriptions();
  }, []);

  // -------------------------------------------------
  // FIXED: SINGLE addSubscription FUNCTION
  // -------------------------------------------------
  const addSubscription = async (newSub) => {
    const optimSub = formatSubscriptionData({ ...newSub, _id: Date.now() });

    setSubscriptions((prev) => [...prev, optimSub]);

    const token = localStorage.getItem("nf_token");
    if (!token) return;

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSub),
      });

      if (res.ok) {
        const savedSub = await res.json();

        setSubscriptions((prev) =>
          prev.map((s) =>
            s.id === optimSub.id ? formatSubscriptionData(savedSub) : s
          )
        );
      }
    } catch (err) {
      console.error("Failed to save subscription", err);
    }
  };

  // -------------------------------------------------
  // FIXED: SINGLE addTransaction FUNCTION
  // -------------------------------------------------
  const addTransaction = async (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.type === "income") {
      setNetWorth((prev) => prev + newTx.amount);
      setMonthlyGrowth((prev) => prev + newTx.amount);
    } else {
      setNetWorth((prev) => prev - newTx.amount);
    }

    const token = localStorage.getItem("nf_token");
    if (!token) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTx),
      });

      if (!res.ok) return;

      const savedTx = await res.json();
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === newTx.id ? savedTx : tx))
      );
    } catch (err) {
      console.error("Failed to save transaction", err);
    }
  };

  // -------------------------------------------------
  // FAMILY METHODS (unchanged)
  // -------------------------------------------------
  const addFamilyMember = async (newMember) => {
    setFamilyMembers((prev) => [...prev, newMember]);

    const token = localStorage.getItem("nf_token");
    if (!token) return;

    try {
      const res = await fetch("/api/family/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) return;

      const saved = await res.json();
      setFamilyMembers((prev) =>
        prev.map((m) => (m.id === newMember.id ? saved : m))
      );
    } catch (err) {
      console.error("Failed to save family member", err);
    }
  };

  const deleteFamilyMember = async (member) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== member.id));

    const token = localStorage.getItem("nf_token");
    if (!token || !member.id) return;

    try {
      await fetch(`/api/family/members/${member.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete family member", err);
    }
  };

  const addFamilyTransaction = async (tx) => {
    setFamilyTransactions((prev) => [tx, ...prev]);

    const token = localStorage.getItem("nf_token");
    if (!token) return;

    try {
      const res = await fetch("/api/family/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tx),
      });

      if (!res.ok) return;

      const saved = await res.json();
      setFamilyTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? saved : t))
      );
    } catch (err) {
      console.error("Failed to save family transaction", err);
    }
  };

  const updateFamilyTransaction = async (updated) => {
    setFamilyTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );

    const token = localStorage.getItem("nf_token");
    if (!token || !updated.id) return;

    try {
      await fetch(`/api/family/transactions/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to update family transaction", err);
    }
  };

  // -------------------------------------------------
  // GOALS (unchanged)
  // -------------------------------------------------
  const addGoal = async (newGoal) => {
    const token = localStorage.getItem("nf_token");

    if (!token) {
      setGoals((prev) => [...prev, newGoal]);
      setActiveGoalsCount((c) => c + 1);
      return;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      const saved = res.ok ? await res.json() : newGoal;

      setGoals((prev) => [...prev, saved]);
      setActiveGoalsCount((c) => c + 1);
    } catch (err) {
      console.error("Failed to save goal", err);
      setGoals((prev) => [...prev, newGoal]);
      setActiveGoalsCount((c) => c + 1);
    }
  };

  const deleteGoal = async (goal) => {
    setGoals((prev) => prev.filter((g) => g.id !== goal.id));
    setActiveGoalsCount((c) => Math.max(0, c - 1));

    const token = localStorage.getItem("nf_token");
    if (!token || !goal.id) return;

    try {
      await fetch(`/api/goals/${goal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const updateGoal = async (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );

    const token = localStorage.getItem("nf_token");
    if (!token || !updatedGoal.id) return;

    try {
      const res = await fetch(`/api/goals/${updatedGoal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!res.ok) return;

      const saved = await res.json();

      setGoals((prev) =>
        prev.map((g) => (g.id === saved.id ? saved : g))
      );
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  };

  // -------------------------------------------------
  // LOADERS
  // -------------------------------------------------
 useEffect(() => {
  const loadCard = async () => {
    const token = localStorage.getItem("nf_token");
    if (!token) return;

    try {
      // Include the auth token
      const res = await fetch("/api/card", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        console.log("No card found or unauthorized");
        return;
      }

      // Backend returns 1 card object, not an array
      const card = await res.json();

      setUserCard(card);
      
    } catch (err) {
      console.error("Failed to fetch card", err);
    }
  };

  loadCard();
}, []);

  
  useEffect(() => {
    const stored = localStorage.getItem("nf_user");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nf_token");
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch("/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data)) {
          setGoals(data);
          setActiveGoalsCount(data.length);
        }
      } catch (err) {}
    };

    load();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nf_token");
    if (!token) return;

    const loadMembers = async () => {
      try {
        const res = await fetch("/api/family/members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setFamilyMembers(data);
      } catch {}
    };

    loadMembers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nf_token");
    if (!token) return;

    const loadTx = async () => {
      try {
        const res = await fetch("/api/family/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        setFamilyTransactions(await res.json());
      } catch {}
    };
    loadTx();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nf_token");
    if (!token) return;

    const loadTx = async () => {
      try {
        const res = await fetch("/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        setTransactions(await res.json());
      } catch {}
    };

    loadTx();
  }, []);

  // -------------------------------------------------
  // OTHER HANDLERS
  // -------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const update = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nf_token");
    localStorage.removeItem("nf_user");
    navigate("/login");
  };

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "family", label: "Family", icon: Users },
    { id: "insights", label: "AI Insights", icon: Brain },
  ];
  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative pb-40 lg:pb-0">
      {/* Ambient Background - Clean & Premium */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-zinc-800 rounded-full blur-[150px] lg:blur-[200px]"
        />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03], x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-0 w-[600px] lg:w-[900px] h-[600px] lg:h-[900px] bg-emerald-900 rounded-full blur-[180px] lg:blur-[220px]"
        />

        <motion.div
          className="hidden lg:block absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)", left: mousePosition.x - 300, top: mousePosition.y - 300 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Desktop Nav Bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 border-b border-white/[0.08] backdrop-blur-2xl bg-[#050505]/80 sticky top-0 hidden lg:block"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.03) inset" }}
      >
        <div className="max-w-[2000px] mx-auto px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <motion.div whileHover={{ scale: 1.05, rotate: 180 }} transition={{ duration: 0.6 }} className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-2xl bg-white p-[1px]">
                  <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl tracking-tight text-white font-medium">Nuerofin</h1>
                <p className="text-xs text-white/40 tracking-wide uppercase">Money OS</p>
              </div>
            </div>

            <div className="flex gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveView(item.id)}
                    className="relative px-6 py-3 rounded-2xl transition-all overflow-hidden group"
                  >
                    {isActive && (
                      <>
                        <motion.div layoutId="activeTab" className={`absolute inset-0 bg-white/[0.08]`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                      </>
                    )}
                    <div className="relative flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/40"}`} />
                      <span className={`text-sm ${isActive ? "text-white" : "text-white/40"}`}>{item.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="relative p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10" 
                    onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        setNotificationCount(0);
                    }}
                  >
                    <Bell className="w-5 h-5 text-zinc-300" />
                    {notificationCount > 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-black font-bold">
                        {notificationCount}
                      </motion.div>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {isNotificationsOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 z-50 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                        >
                            <div className="p-4 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-medium text-white text-sm">Notifications</h3>
                                <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-500 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                                {[
                                    { title: "Goal Achieved!", desc: "Europe Trip fund reached 75%", time: "2m ago", color: "bg-emerald-500" },
                                    { title: "Budget Alert", desc: "Shopping budget 85% used", time: "3h ago", color: "bg-rose-500" },
                                    { title: "Salary Credited", desc: "₹95,000 deposited", time: "1d ago", color: "bg-blue-500" },
                                    { title: "Investment Update", desc: "Portfolio up by 12.5%", time: "2d ago", color: "bg-amber-500" }
                                ].map((n, i) => (
                                    <div key={i} className="p-3 rounded-xl hover:bg-white/[0.04] transition-colors flex gap-3 group cursor-pointer">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${n.color} flex-shrink-0 group-hover:scale-125 transition-transform`} />
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{n.title}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{n.desc}</p>
                                            <p className="text-[10px] text-zinc-600 mt-1.5">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-white/[0.06] text-center bg-white/[0.02]">
                                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors" onClick={() => { setActiveView("analytics"); setIsNotificationsOpen(false); }}>
                                    View all activity
                                </button>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              <motion.button onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10" title="Logout">
                <LogOut className="w-5 h-5 text-zinc-300" />
              </motion.button>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg font-bold text-white">
                {userData.name ? userData.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{userData.name}</p>
                <p className="text-xs text-emerald-400">Premium</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="hidden lg:block border-t border-white/[0.05] px-10 py-4 bg-[#050505]/50 backdrop-blur-md">
          <div className="max-w-[2000px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[
                { label: "Net Worth", value: `₹${(netWorth/100000).toFixed(2)}L`, change: "+8.5%", color: "#10b981", icon: Wallet }, // Emerald-500
                { label: "Monthly Growth", value: `₹${(monthlyGrowth/1000).toFixed(1)}k`, change: "+12%", color: "#3b82f6", icon: TrendingUp }, // Blue-500
                { label: "Active Goals", value: `${activeGoalsCount}/4`, change: "94%", color: "#f59e0b", icon: Activity }, // Amber-500
                { label: "Automations", value: "5", change: "Running", color: "#10b981", icon: Zap },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5">
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-200">{stat.value}</p>
                        <span className="text-xs" style={{ color: stat.color }}>{stat.change}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-sm text-zinc-500">
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} • {currentTime.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.08] px-5 py-4 z-50 safe-area-bottom">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-semibold text-white">Nuerofin</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button className="relative p-2" onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setNotificationCount(0); }}>
                        <Bell className="w-6 h-6 text-zinc-400" />
                        {notificationCount > 0 && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black" />}
                    </button>
                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-2 w-80 z-50 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                            >
                                <div className="p-4 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
                                    <h3 className="font-medium text-white text-sm">Notifications</h3>
                                    <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-500 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                                    {[
                                        { title: "Goal Achieved!", desc: "Europe Trip fund reached 75%", time: "2m ago", color: "bg-emerald-500" },
                                        { title: "Budget Alert", desc: "Shopping budget 85% used", time: "3h ago", color: "bg-rose-500" },
                                        { title: "Salary Credited", desc: "₹95,000 deposited", time: "1d ago", color: "bg-blue-500" },
                                        { title: "Investment Update", desc: "Portfolio up by 12.5%", time: "2d ago", color: "bg-amber-500" }
                                    ].map((n, i) => (
                                        <div key={i} className="p-3 rounded-xl hover:bg-white/[0.04] transition-colors flex gap-3 group cursor-pointer">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${n.color} flex-shrink-0 group-hover:scale-125 transition-transform`} />
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{n.title}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{n.desc}</p>
                                                <p className="text-[10px] text-zinc-600 mt-1.5">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-white/[0.06] text-center bg-white/[0.02]">
                                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors" onClick={() => { setActiveView("analytics"); setIsNotificationsOpen(false); }}>
                                        View all activity
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div onClick={() => setIsMobileMenuOpen(true)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white">
                    {userData.name ? userData.name[0].toUpperCase() : "U"}
                </div>
            </div>
        </div>
      </div>

      {/* Mobile User Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-[#050505] p-6 lg:hidden flex flex-col"
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex items-center justify-center text-4xl font-bold mb-2 text-white">
                {userData.name ? userData.name[0].toUpperCase() : "U"}
              </div>
              <h2 className="text-2xl font-light text-white">{userData.name}</h2>
              <p className="text-zinc-500 -mt-4">{userData.email}</p>
              
              <div className="w-full h-px bg-white/10 my-4" />
              
              <button className="w-full p-4 rounded-2xl bg-white/5 flex items-center gap-4 text-lg text-zinc-300">
                <Settings className="w-6 h-6 text-zinc-500" />
                Settings
              </button>
              <button className="w-full p-4 rounded-2xl bg-white/5 flex items-center gap-4 text-lg text-zinc-300">
                <Download className="w-6 h-6 text-zinc-500" />
                Export Data
              </button>
              <button onClick={handleLogout} className="w-full p-4 rounded-2xl bg-red-500/10 text-red-400 flex items-center gap-4 text-lg mt-auto">
                <LogOut className="w-6 h-6" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 mt-16 lg:mt-0">
        
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2">
            <div>
              <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl lg:text-6xl mb-2 lg:mb-3 tracking-tight text-white font-light">
                {getGreeting()}, <span className="text-zinc-500">{userData.name ? userData.name.split(' ')[0] : 'Friend'}</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-zinc-500 text-sm lg:text-xl">
                Your financial universe • {currentTime.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">
           
                  <FinancialHealthScore netWorth={netWorth} />
                  <SpendingGraph />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <FestivePlanner />
                    {/* CHANGED: Passed props to SubscriptionTracker */}
                    <SubscriptionTracker subscriptions={subscriptions} onAddSubscription={addSubscription} />
                  </div>
                  <AutomationsHub />
                </div>
                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                  {userCard && <UserCard card={userCard} />} 
                  <SmartAccounts netWorth={netWorth} />
                  <GoalsSection goals={goals} onAddGoal={addGoal} onDeleteGoal={deleteGoal} onUpdateGoal={updateGoal} />
                  <FinancialChallenges />
                  <FuturePlanning />
                  <NotificationsFeed />
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                  <CashFlowAnalysis />
                  <InvestmentPortfolio />
                  <SpendingHeatmap />
                  <TransactionFlow transactions={transactions} onAddTransaction={addTransaction} />
                </div>
                <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                  <VoiceOfMoney />
                  {/* CHANGED: SubscriptionTracker here too */}
                  <SubscriptionTracker subscriptions={subscriptions} onAddSubscription={addSubscription} />
                  <GoalsSection goals={goals} onAddGoal={addGoal} onDeleteGoal={deleteGoal} onUpdateGoal={updateGoal} />
                  <NotificationsFeed />
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "family" && (
            <motion.div key="family" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              <FamilyFinance
                members={familyMembers}
                onAddMember={addFamilyMember}
                transactions={familyTransactions}
                onAddTransaction={addFamilyTransaction}
                onUpdateTransaction={updateFamilyTransaction}
                onDeleteMember={deleteFamilyMember}
                goals={goals}
                onAddGoal={addGoal}
              />
            </motion.div>
          )}

          {activeView === "insights" && (
            <motion.div key="insights" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              <SmartInsights />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/assistant')}
        className="fixed bottom-24 lg:bottom-10 right-6 lg:right-10 z-40 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] border border-white/20"
      >
        <MessageSquareText className="w-7 h-7" />
      </motion.button>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 z-50 safe-area-bottom">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-white/10 text-white" : "text-white/40"}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] ${isActive ? "text-white" : "text-white/40"}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}