import { motion } from "framer-motion"
import { Target, Plus, X, Pencil } from "lucide-react"

import { useState } from "react"
import { createPortal } from "react-dom"

const GoalsSection = ({ goals = [], onAddGoal, onDeleteGoal, onUpdateGoal }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Default to Premium Blue instead of Neon Cyan
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', emoji: '🎯', color: '#3b82f6' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoal, setEditGoal] = useState({ name: '', target: '', current: '', emoji: '🎯', color: '#3b82f6' });

  // Premium Fintech Color Palette
  const colorOptions = [
    '#3b82f6', // Royal Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#f43f5e'  // Rose
  ];

  // Fallback data if no props passed
  const displayGoals = Array.isArray(goals) ? goals : [];

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.target) return;

    if (onAddGoal) {
        onAddGoal({
            id: Date.now(), 
            name: newGoal.name,
            target: Number(newGoal.target),
            current: Number(newGoal.current) || 0,
            emoji: newGoal.emoji,
            color: newGoal.color
        });
    }

    setIsModalOpen(false);
    setNewGoal({ name: '', target: '', current: '', emoji: '🎯', color: '#3b82f6' });
  };

  const openEditModal = (goal) => {
    if (!onUpdateGoal) return;
    setEditingGoal(goal);
    setEditGoal({
      name: goal.name || '',
      target: goal.target ?? '',
      current: goal.current ?? '',
      emoji: goal.emoji || '🎯',
      color: goal.color || '#3b82f6'
    });
    setIsEditModalOpen(true);
  };

  const handleEditGoal = (e) => {
    e.preventDefault();
    if (!editingGoal || !onUpdateGoal) return;

    onUpdateGoal({
      ...editingGoal,
      name: editGoal.name,
      target: Number(editGoal.target) || 0,
      current: Number(editGoal.current) || 0,
      emoji: editGoal.emoji,
      color: editGoal.color
    });

    setIsEditModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      // CHANGED: Matte Black Background
      className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-white">Goals</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          // CHANGED: Solid Zinc Button
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* MODAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                // CHANGED: Darker Modal Background
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-xl font-medium text-white">New Goal</h3>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-4 relative z-10">
                    
                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <input 
                            type="text" 
                            placeholder="Goal Name (e.g. Goa Trip)" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                            value={newGoal.name} 
                            onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                        />
                    </div>

                    {/* Amount Inputs Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="number" 
                            placeholder="Target Amount" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                            value={newGoal.target} 
                            onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder="Current Saved" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                            value={newGoal.current} 
                            onChange={e => setNewGoal({...newGoal, current: e.target.value})}
                        />
                    </div>

                    {/* Color Picker - Premium Palette */}
                    <div className="py-2">
                        <p className="text-xs text-zinc-500 mb-3 ml-1">Theme Color</p>
                        <div className="flex gap-4">
                            {colorOptions.map(c => (
                                <div 
                                    key={c} 
                                    onClick={() => setNewGoal({...newGoal, color: c})} 
                                    className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${newGoal.color === c ? 'scale-110' : 'hover:scale-105'}`}
                                    style={{
                                        background: c,
                                        boxShadow: newGoal.color === c ? `0 0 15px ${c}40` : 'none',
                                        border: newGoal.color === c ? '2px solid white' : '2px solid transparent'
                                    }} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button - Solid White */}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-2 hover:bg-zinc-200 transition-colors"
                    >
                        Create Goal
                    </motion.button>
                </form>
            </motion.div>
        </div>,
        document.body
      )}

      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-medium text-white">Edit Goal</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleEditGoal} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Goal Name" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                  value={editGoal.name}
                  onChange={e => setEditGoal({ ...editGoal, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Target Amount" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                  value={editGoal.target}
                  onChange={e => setEditGoal({ ...editGoal, target: e.target.value })}
                />
                <input 
                  type="number" 
                  placeholder="Current Saved" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                  value={editGoal.current}
                  onChange={e => setEditGoal({ ...editGoal, current: e.target.value })}
                />
              </div>

              <div className="py-2">
                <p className="text-xs text-zinc-500 mb-3 ml-1">Theme Color</p>
                <div className="flex gap-4">
                  {colorOptions.map(c => (
                    <div 
                      key={c} 
                      onClick={() => setEditGoal({ ...editGoal, color: c })} 
                      className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${editGoal.color === c ? 'scale-110' : 'hover:scale-105'}`}
                      style={{
                        background: c,
                        boxShadow: editGoal.color === c ? `0 0 15px ${c}40` : 'none',
                        border: editGoal.color === c ? '2px solid white' : '2px solid transparent'
                      }} 
                    />
                  ))}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-2 hover:bg-zinc-200 transition-colors"
              >
                Save Changes
              </motion.button>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Goals List - Preserved Liquid Effect with New Colors */}
      <div className="space-y-4">
        {displayGoals.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <Target className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-sm text-zinc-500">No goals set yet</p>
          </div>
        ) : (
          displayGoals.map((goal, index) => {

            const percentage = (goal.current / goal.target) * 100

            return (
              <motion.div
                key={goal.id ?? index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                {/* Jar Container - Clean Glass */}
                <div className="relative h-40 rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                  {onUpdateGoal && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEditModal(goal); }}
                      className="absolute top-3 right-9 z-20 p-1.5 rounded-full bg-black/40 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                  {onDeleteGoal && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteGoal(goal); }}
                      className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 border border-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  {/* Liquid Fill */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                      delay: 0.8 + index * 0.1
                    }}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      // Using the goal color but with cleaner opacity
                      background: `linear-gradient(180deg, ${goal.color}E6, ${goal.color}99)`, // E6 = 90%, 99 = 60%
                      boxShadow: `0 -5px 30px ${goal.color}40`
                    }}
                  >
                    {/* Wave Effect */}
                    <motion.div
                      animate={{
                        x: [0, 20, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-0 left-0 right-0 h-6"
                      style={{
                        background: `radial-gradient(ellipse at center, ${goal.color}60 0%, transparent 70%)`
                      }}
                    />
                  </motion.div>

                  {/* Goal Info Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-3xl mb-2 drop-shadow-md"
                    >
                      {goal.emoji}
                    </motion.div>
                    <p className="text-sm mb-1 font-medium text-white shadow-black drop-shadow-sm">{goal.name}</p>
                    <p className="text-xs text-white/80 mb-2 font-medium">
                      {Math.round(percentage)}% Complete
                    </p>

                    <div className="text-center">
                      <motion.p
                        className="text-lg font-bold tracking-tight text-white drop-shadow-md"
                      >
                        ₹{(goal.current / 1000).toFixed(0)}k
                      </motion.p>
                      <p className="text-xs text-white/60 font-medium">
                        of ₹{(goal.target / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
export default GoalsSection;