import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Calendar
} from "lucide-react"

export function InsightsPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-white mb-1">Insights</h2>
        <p className="text-sm text-gray-400">Your financial overview</p>
      </div>

      {/* 7-Day Cashflow Forecast */}
      <div className="border border-gray-700 rounded-xl p-4 bg-[#1A1C1E] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-white">7-Day Cashflow Forecast</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-white">₹84,250</span>
            <span className="text-sm text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              12.5%
            </span>
          </div>
          <p className="text-sm text-gray-400">Expected balance by Dec 2</p>

          {/* Mini chart representation */}
          <div className="flex items-end gap-1 h-12 mt-4">
            {[60, 75, 68, 82, 78, 88, 100].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-900 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="border border-gray-700 rounded-xl p-4 bg-[#1A1C1E] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-white">Recent Transactions</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              name: "Grocery Store",
              amount: "-₹2,340",
              category: "Shopping",
              time: "2h ago"
            },
            {
              name: "Salary Deposit",
              amount: "+₹45,000",
              category: "Income",
              time: "1d ago"
            },
            {
              name: "Electric Bill",
              amount: "-₹1,850",
              category: "Utilities",
              time: "2d ago"
            }
          ].map((transaction, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-white">{transaction.name}</p>
                <p className="text-xs text-gray-400">
                  {transaction.category} • {transaction.time}
                </p>
              </div>
              <span
                className={`text-sm ${
                  transaction.amount.startsWith("+")
                    ? "text-emerald-400"
                    : "text-white"
                }`}
              >
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Alerts */}
      <div className="border border-amber-900 rounded-xl p-4 bg-amber-950/30 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-white">Spending Alerts</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Shopping spending is 23% higher than usual this week
          </p>
          <div className="w-full bg-amber-900 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full"
              style={{ width: "73%" }}
            />
          </div>
          <p className="text-xs text-gray-400">₹7,300 of ₹10,000 budget used</p>
        </div>
      </div>

      {/* Upcoming Bills */}
      <div className="border border-gray-700 rounded-xl p-4 bg-[#1A1C1E] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-950 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-white">Upcoming Bills</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: "Netflix Subscription", amount: "₹649", date: "Nov 28" },
            { name: "Internet Bill", amount: "₹999", date: "Nov 30" },
            { name: "Credit Card Payment", amount: "₹12,450", date: "Dec 5" }
          ].map((bill, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{bill.name}</p>
                <p className="text-xs text-gray-400">Due {bill.date}</p>
              </div>
              <span className="text-sm text-white">{bill.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
