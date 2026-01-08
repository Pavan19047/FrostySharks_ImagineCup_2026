import React from 'react';
import { motion } from 'framer-motion';

function DownloadCard({ title, onGenerate, loading, urls, draft }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-300">Auto-fill using your chat context. PDF and DOC are created together.</div>
      <div className="flex gap-3">
        <button onClick={onGenerate} disabled={loading} className="btn min-w-[140px]">{loading ? 'Generating...' : 'Generate'}</button>
        {urls?.pdf && (
          <a href={urls.pdf} download={draft?.pdfName} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary text-sm">Download PDF</a>
        )}
        {urls?.doc && (
          <a href={urls.doc} download={draft?.docName} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary text-sm">Download DOC</a>
        )}
      </div>
      {draft?.summary && <div className="text-xs text-slate-400">Summary: {draft.summary}</div>}
    </div>
  );
}

export default function DocumentSection({ onGenerateComplaint, onGenerateRTI, loading, downloadUrls, draftMeta }) {
  return (
    <section id="docs" className="max-w-6xl mx-auto px-4 pb-12 space-y-4">
      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold">Auto legal document generator</motion.h2>
      <div className="grid md:grid-cols-2 gap-4">
        <DownloadCard
          title="Complaint letter"
          onGenerate={() => onGenerateComplaint('complaint')}
          loading={loading === 'complaint'}
          urls={downloadUrls.complaint}
          draft={draftMeta.complaint}
        />
        <DownloadCard
          title="RTI application"
          onGenerate={() => onGenerateRTI('rti')}
          loading={loading === 'rti'}
          urls={downloadUrls.rti}
          draft={draftMeta.rti}
        />
      </div>
      <div className="text-xs text-slate-400">Disclaimer: Generated drafts are guidance, not legal filings. Review before submission.</div>
    </section>
  );
}
