import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Calendar } from "lucide-react"
import "./CustomDatePicker.css"

const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholderText = "Select date",
  minDate = null,
  className = "",
  accentColor = "blue" // blue, emerald, rose, amber
}) => {
  const accentColors = {
    blue: "focus:border-blue-500",
    emerald: "focus:border-emerald-500",
    rose: "focus:border-rose-500",
    amber: "focus:border-amber-500"
  }

  return (
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        placeholderText={placeholderText}
        dateFormat="MMM dd, yyyy"
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white outline-none ${accentColors[accentColor]} focus:bg-white/10 transition-all placeholder:text-zinc-500 ${className}`}
        calendarClassName="custom-datepicker-calendar"
        wrapperClassName="w-full"
        popperClassName="custom-datepicker-popper"
      />
      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
    </div>
  )
}

export default CustomDatePicker
