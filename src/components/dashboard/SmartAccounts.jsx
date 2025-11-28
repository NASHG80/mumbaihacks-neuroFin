import { motion } from "framer-motion"
import {
  Building2,
  CreditCard,
  Wallet,
  TrendingUp,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

const SmartAccounts = ({ netWorth }) => {
  const [balancesVisible, setBalancesVisible] = useState(true)

  const accounts = [
    {
      name: "HDFC Savings",
      type: "Bank Account",
      balance: netWorth ? netWorth * 0.6 : 2847650,
      change: 12500,
      icon: Building2,
      color: "#10b981", // Emerald
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      name: "ICICI Credit Card",
      type: "Credit",
      balance: -45200,
      change: -8300,
      icon: CreditCard,
      color: "#f43f5e", // Rose
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    },
    {
      name: "Paytm Wallet",
      type: "Digital Wallet",
      balance: 12450,
      change: 2100,
      icon: Wallet,
      color: "#f59e0b", // Amber
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      name: "Zerodha",
      type: "Investment",
      balance: netWorth ? netWorth * 0.4 : 1850000,
      change: 45000,
      icon: TrendingUp,
      color: "#3b82f6", // Blue
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    }
  ]

  const formatCurrency = amount => {
    if (!balancesVisible) return "••••••"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Math.abs(amount))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-white">Smart Accounts</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setBalancesVisible(!balancesVisible)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          {balancesVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      <div className="space-y-3">
        {accounts.map((account, index) => {
          const Icon = account.icon
          const isPositiveChange = account.change > 0

          return (
            <motion.div
              key={account.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className={`relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer group overflow-hidden hover:border-white/10`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.bg} border ${account.border}`}
                >
                  <Icon className="w-5 h-5" style={{ color: account.color }} />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{account.type}</p>
                  <p className="mt-0.5 text-white font-medium">{account.name}</p>
                </div>

                <div className="text-right">
                  <motion.p
                    key={balancesVisible ? "visible" : "hidden"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="tracking-tight text-white font-medium"
                  >
                    {account.balance < 0 && "-"}
                    {formatCurrency(account.balance)}
                  </motion.p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isPositiveChange ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {isPositiveChange ? "+" : ""}
                    {balancesVisible ? formatCurrency(account.change) : "•••"}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-6 border-t border-white/[0.06]"
      >
        <div className="flex items-center justify-between">
          <p className="text-zinc-500">Total Net Worth</p>
          <div className="text-right">
            <motion.p
              className="text-2xl tracking-tight text-white font-semibold"
              key={balancesVisible ? "visible" : "hidden"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {formatCurrency(netWorth || 4664900)}
            </motion.p>
            <p className="text-sm text-emerald-500 mt-1">+₹51,300 this month</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default SmartAccounts;