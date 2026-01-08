import React from 'react';
import { motion } from 'framer-motion';

export default function Header({ onToggleTheme, isDark }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-slate-900 font-bold">NS</div>
          <div>
            <div className="font-semibold text-lg">NyayaSaathi</div>
            <div className="text-xs text-slate-400">AI legal & government aid guide</div>
          </div>
        </motion.div>
        <nav className="hidden md:flex items-center gap-4 text-sm text-slate-300">
          <a href="#chat" className="hover:text-primary">Chat</a>
          <a href="#docs" className="hover:text-primary">Documents</a>
          <a href="#about" className="hover:text-primary">Responsible AI</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onToggleTheme} className="px-3 py-2 rounded-xl bg-slate-800 text-sm border border-slate-700 hover:border-primary">
            {isDark ? 'Light' : 'Dark'} mode
          </button>
          <a href="#chat" className="btn text-sm">Start</a>
        </div>
      </div>
    </header>
  );
}
