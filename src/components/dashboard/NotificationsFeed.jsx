import { motion } from "framer-motion"
import { Bell, TrendingUp, AlertCircle, CheckCircle, Sparkles, DollarSign } from "lucide-react"

const NotificationsFeed = () => {
  const notifications = [
    {
      type: "success",
      icon: CheckCircle,
      title: "Goal Achieved!",
      message: "Europe Trip fund reached 75%",
      time: "2m ago",
      color: "#10b981"
    },
    {
      type: "alert",
      icon: AlertCircle,
      title: "Budget Alert",
      message: "Shopping budget 85% used",
      time: "3h ago",
      color: "#f43f5e"
    },
    {
      type: "income",
      icon: DollarSign,
      title: "Salary Credited",
      message: "₹95,000 deposited",
      time: "1d ago",
      color: "#3b82f6"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Activity</h3>
          <p className="text-xs text-zinc-500">Recent updates</p>
        </div>
        <Bell className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const Icon = notification.icon
          return (
            <div
              key={index}
              className="relative p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${notification.color}15`, color: notification.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-white">{notification.title}</p>
                    <span className="text-[10px] text-zinc-500">{notification.time}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{notification.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
export default NotificationsFeed;