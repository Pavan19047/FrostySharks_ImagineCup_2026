import React from 'react';
import { motion } from 'framer-motion';

const stepsOrder = [
  { key: 'issue', label: 'Issue identified' },
  { key: 'rights', label: 'Rights explained' },
  { key: 'document', label: 'Document generated' },
  { key: 'next', label: 'Next steps suggested' }
];

export default function JourneyTracker({ status }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-10">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Legal journey tracker</div>
          <div className="text-xs text-slate-400">Stay oriented</div>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {stepsOrder.map((step, idx) => {
            const done = Boolean(status[step.key]);
            return (
              <motion.div key={step.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl border ${done ? 'border-primary bg-primary/10' : 'border-slate-800 bg-slate-900/60'}`}>
                <div className="text-xs text-slate-400">Step {idx + 1}</div>
                <div className="font-semibold">{step.label}</div>
                <div className="text-xs text-slate-300 mt-1">{done ? 'Completed' : 'Pending'}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
