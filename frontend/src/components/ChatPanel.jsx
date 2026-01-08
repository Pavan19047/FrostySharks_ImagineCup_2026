import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel({
  messages,
  onSend,
  isLoading,
  language,
  setLanguage,
  safeMode,
  setSafeMode,
  followUps,
  onExplainRights,
  onSelectFollowUp
}) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <section id="chat" className="max-w-6xl mx-auto px-4 pb-12 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card p-4 flex flex-col h-[640px]">
        <div className="flex items-center gap-3 mb-3">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input max-w-[160px]">
            <option value="english">English</option>
            <option value="hindi">Hindi (placeholder)</option>
            <option value="kannada">Kannada (placeholder)</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={safeMode} onChange={(e) => setSafeMode(e.target.checked)} />
            Safe mode (no history saved)
          </label>
          <button onClick={onExplainRights} className="px-3 py-2 rounded-xl bg-slate-800 text-sm border border-slate-700 hover:border-primary ml-auto">Explain my rights</button>
        </div>
        <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-2xl ${msg.sender === 'ai' ? 'bg-slate-800/80' : 'bg-primary/10 border border-primary/30'} whitespace-pre-line text-sm`}
              >
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">{msg.sender === 'ai' ? 'NyayaSaathi' : 'You'}</div>
                <div className="text-slate-100">{msg.text}</div>
                {msg.meta?.issueType && (
                  <div className="mt-2 text-xs text-primary">Issue type: {msg.meta.issueType}</div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-2xl bg-slate-800/80 text-sm text-slate-300">
                Thinking...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            className="input"
            placeholder="Describe your issue in simple words"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button onClick={handleSubmit} disabled={isLoading} className="btn min-w-[100px]">
            Send
          </button>
        </div>
        {followUps?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {followUps.map((q, i) => (
              <button key={i} onClick={() => onSelectFollowUp(q)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary">
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="card p-4 space-y-4">
        <div className="text-sm text-slate-400">Disclaimers</div>
        <ul className="text-sm text-slate-200 space-y-2 list-disc pl-5">
          <li>This is guidance, not legal advice.</li>
          <li>No legal certainty. If unsure, we say so.</li>
          <li>Safe mode keeps interactions ephemeral.</li>
        </ul>
        <div className="text-sm text-slate-400">Smart tips</div>
        <div className="text-sm text-slate-200 space-y-2">
          <div>Include dates, places, and documents you have.</div>
          <div>Mention whether you contacted authorities before.</div>
        </div>
      </div>
    </section>
  );
}
