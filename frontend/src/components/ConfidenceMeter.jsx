import React from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceMeter({ aiConfidence, userConfidence, setUserConfidence }) {
  const pct = Math.round((aiConfidence || 0) * 100);
  return (
    <section className="max-w-6xl mx-auto px-4 pb-10">
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Legal confidence meter</div>
            <div className="text-sm text-slate-400">AI estimation plus your feedback to improve prompts</div>
          </div>
          <div className="text-sm text-primary">AI confidence: {pct}%</div>
        </div>
        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-primary to-secondary" />
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <label className="min-w-[180px]">How confident are you now?</label>
          <input
            type="range"
            min="0"
            max="100"
            value={userConfidence}
            onChange={(e) => setUserConfidence(Number(e.target.value))}
            className="flex-1"
          />
          <div className="font-semibold">{userConfidence}%</div>
        </div>
        <div className="text-xs text-slate-400">Feedback is stored only in-session and used to refine next prompts locally.</div>
      </div>
    </section>
  );
}
