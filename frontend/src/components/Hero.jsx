import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onStart }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-12 grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold leading-tight">
          Your friendly guide for legal and government help.
        </motion.h1>
        <p className="text-lg text-slate-300">
          Explain your problem in plain words. NyayaSaathi asks the right follow-ups, explains your rights, drafts complaint letters and RTI applications, and suggests next steps with timelines.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onStart} className="btn">Start chatting</button>
          <div className="badge">Safe mode ready</div>
          <div className="badge">Multilingual</div>
        </div>
        <div className="text-xs text-slate-500">
          Responsible AI: No legal certainty promises. We include clear disclaimers and ask you to verify with a lawyer.
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
        <div className="text-sm text-slate-400">Live preview</div>
        <div className="bg-slate-900 rounded-xl p-4 space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="badge">You</span>
            <span>I am facing salary delays for 3 months.</span>
          </div>
          <div className="flex gap-2">
            <span className="badge bg-primary/20 text-primary">NyayaSaathi</span>
            <span>Sorry to hear that. To guide you, please share: 1) Do you have a written offer/contract? 2) Number of employees affected?</span>
          </div>
          <div className="flex gap-2">
            <span className="badge">You</span>
            <span>We have offer letters.</span>
          </div>
          <div className="flex gap-2">
            <span className="badge bg-primary/20 text-primary">NyayaSaathi</span>
            <span>Thanks. This looks like a labor issue. I will draft a complaint and outline your rights. Confidence meter: 0.68.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
