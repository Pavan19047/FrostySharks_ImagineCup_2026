import React, { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setStatus({ type: 'success', data });
      } else {
        setStatus({ type: 'error', message: `Backend returned ${res.status}` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: `Cannot reach backend: ${err.message}` });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!status) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-4">
      {status.type === 'success' ? (
        <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700 text-sm flex items-center justify-between">
          <div>
            <span className="font-semibold">System Ready</span> · Backend: {status.data.app} · AI: {status.data.aiProvider} ({status.data.ollamaModel})
          </div>
          <button onClick={checkStatus} className="text-xs px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700">
            {checking ? 'Checking...' : 'Refresh'}
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-700 text-sm flex items-center justify-between">
          <div>
            <span className="font-semibold">System Error</span> · {status.message}
          </div>
          <button onClick={checkStatus} className="text-xs px-2 py-1 rounded bg-rose-800 hover:bg-rose-700">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
