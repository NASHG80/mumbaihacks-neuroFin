import React, { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import { InsightsPanel } from './InsightsPanel';
import { QuickActionsPanel } from './QuickActionsPanel';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ChatInterface() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-[calc(100vh-80px)] lg:h-screen bg-[#00010D] text-white overflow-hidden relative">

      {/* LEFT SIDEBAR - Insights (Desktop) */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="hidden xl:flex flex-col w-80 border-r border-white/5 bg-[#05050A]"
      >
        <div className="p-6 pb-2 shrink-0">
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7433FF] via-[#3BF7FF] to-[#E4C580] p-[1px]">
              <div className="w-full h-full bg-[#05050A] rounded-[10px] flex items-center justify-center">
                <img src="../src/assets/logo.png" />
              </div>
            </div>
            <span className="text-lg font-medium tracking-wide text-white">
              NeuroFin
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <InsightsPanel />
        </div>
      </motion.div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-[#00010D]">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3BF7FF]" />
            <span className="font-medium">NeuroFin Assistant</span>
          </div>
          <button onClick={() => setShowMobileSidebar(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
        >
          <ChatPanel />
        </motion.div>
      </div>

      {/* RIGHT SIDEBAR (Desktop) */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="hidden lg:block w-80 border-l border-white/5 overflow-y-auto custom-scrollbar bg-[#05050A]"
      >
        <QuickActionsPanel />
      </motion.div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {showMobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A0A10] border-l border-white/10 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setShowMobileSidebar(false)}>
                  <X className="w-6 h-6 text-white/50" />
                </button>
              </div>

              <QuickActionsPanel />
              <div className="h-px bg-white/10 my-2 mx-6" />
              <InsightsPanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default ChatInterface;