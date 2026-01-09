import React, { useEffect, useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChatPanel from './components/ChatPanel';
import JourneyTracker from './components/JourneyTracker';
import ConfidenceMeter from './components/ConfidenceMeter';
import DocumentSection from './components/DocumentSection';
import AboutSection from './components/AboutSection';
import SystemStatus from './components/SystemStatus';
import { sendChat, explainRights, generateDocument } from './services/api';

function b64ToUrl(base64, type) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const blob = new Blob([new Uint8Array(byteNumbers)], { type });
  return URL.createObjectURL(blob);
}

export default function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am NyayaSaathi. Tell me your issue in simple words. This is guidance, not legal advice.' }
  ]);
  const [language, setLanguage] = useState('english');
  const [safeMode, setSafeMode] = useState(true);
  const [followUps, setFollowUps] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(0.45);
  const [userConfidence, setUserConfidence] = useState(50);
  const [nextSteps, setNextSteps] = useState([]);
  const [rightsSummary, setRightsSummary] = useState([]);
  const [journey, setJourney] = useState({ issue: false, rights: false, document: false, next: false });
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState({ complaint: {}, rti: {} });
  const [draftMeta, setDraftMeta] = useState({ complaint: null, rti: null });
  const [themeDark, setThemeDark] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (themeDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [themeDark]);

  const historyForApi = useMemo(
    () =>
      messages.map((m) => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      })),
    [messages]
  );

  const handleSend = async (text) => {
    setError('');
    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);
    try {
      const data = await sendChat({ message: text, history: historyForApi, language, safeMode });
      if (!data || !data.reply) {
        throw new Error('Invalid response from AI');
      }
      const aiMsg = {
        sender: 'ai',
        text: data.reply,
        meta: { issueType: data.issueType }
      };
      setMessages((prev) => [...prev, aiMsg]);
      setFollowUps(Array.isArray(data.followUps) ? data.followUps : []);
      setAiConfidence(data.confidence || 0.45);
      setNextSteps(Array.isArray(data.nextSteps) ? data.nextSteps : []);
      setRightsSummary(Array.isArray(data.rightsSummary) ? data.rightsSummary : []);
      setJourney((prev) => ({ 
        ...prev, 
        issue: true, 
        next: Boolean((data.nextSteps || []).length) 
      }));
    } catch (e) {
      console.error('Chat error:', e);
      setError(`Failed to contact AI: ${e.message}. Check backend and ensure Ollama is running.`);
      // Remove the user message if AI failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleExplainRights = async () => {
    setError('');
    if (!messages.length || messages.length <= 1) {
      setError('Please describe your issue first before requesting rights explanation.');
      return;
    }
    setIsLoadingChat(true);
    try {
      const data = await explainRights({ message: 'Explain my rights for the current issue', history: historyForApi, language });
      if (data?.rights) {
        const rightsArray = Array.isArray(data.rights) ? data.rights : [data.rights];
        setRightsSummary(rightsArray);
        setAiConfidence(data?.confidence || aiConfidence);
        setJourney((prev) => ({ ...prev, rights: true }));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `${rightsArray.join('\n\n')}\n\nDisclaimer: ${data.disclaimer || 'This is guidance, not legal advice.'}`
          }
        ]);
      }
    } catch (e) {
      console.error('Rights error:', e);
      setError(`Unable to explain rights: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleFollowUp = (q) => handleSend(q);

  const handleGenerate = async (type) => {
    if (messages.length <= 1) {
      setError('Please have a conversation first before generating documents.');
      return;
    }
    setLoadingDoc(type);
    setError('');
    try {
      const res = await generateDocument({ type, history: historyForApi, details: { language, confidence: aiConfidence } });
      if (!res.pdf || !res.doc || !res.draft) {
        throw new Error('Invalid response from server');
      }
      const pdfUrl = b64ToUrl(res.pdf.data, 'application/pdf');
      const docUrl = b64ToUrl(res.doc.data, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      setDownloadUrls((prev) => ({ ...prev, [type]: { pdf: pdfUrl, doc: docUrl } }));
      setDraftMeta((prev) => ({
        ...prev,
        [type]: {
          pdfName: res.pdf.filename,
          docName: res.doc.filename,
          summary: res.draft.subject || 'Draft ready'
        }
      }));
      setJourney((prev) => ({ ...prev, document: true }));
    } catch (e) {
      console.error('Document generation error:', e);
      setError(`Document generation failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoadingDoc(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <Header onToggleTheme={() => setThemeDark((v) => !v)} isDark={themeDark} />
      <Hero onStart={() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })} />

      <SystemStatus />

      {error && (
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-700 text-sm">{error}</div>
        </div>
      )}

      <ChatPanel
        messages={messages}
        onSend={handleSend}
        isLoading={isLoadingChat}
        language={language}
        setLanguage={setLanguage}
        safeMode={safeMode}
        setSafeMode={setSafeMode}
        followUps={followUps}
        onExplainRights={handleExplainRights}
        onSelectFollowUp={handleFollowUp}
      />

      <JourneyTracker status={journey} />

      <section className="max-w-6xl mx-auto px-4 pb-10 grid md:grid-cols-2 gap-4">
        <div className="card p-5 space-y-3">
          <div className="font-semibold">Next-step recommendations</div>
          <div className="text-sm text-slate-300">Suggested places to submit and timelines.</div>
          <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
            {(nextSteps || []).map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
            {nextSteps.length === 0 && <li className="text-slate-500">Ask a question to get tailored next steps.</li>}
          </ul>
        </div>
        <div className="card p-5 space-y-3">
          <div className="font-semibold">Explain my rights</div>
          <div className="text-sm text-slate-300">Plain-language rights with optional citations.</div>
          <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
            {(rightsSummary || []).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
            {rightsSummary.length === 0 && <li className="text-slate-500">Use "Explain my rights" to populate this.</li>}
          </ul>
        </div>
      </section>

      <ConfidenceMeter aiConfidence={aiConfidence} userConfidence={userConfidence} setUserConfidence={setUserConfidence} />

      <DocumentSection
        onGenerateComplaint={() => handleGenerate('complaint')}
        onGenerateRTI={() => handleGenerate('rti')}
        loading={loadingDoc}
        downloadUrls={downloadUrls}
        draftMeta={draftMeta}
      />

      <AboutSection />

      <footer className="max-w-6xl mx-auto px-4 pb-8 text-xs text-slate-500">
        NyayaSaathi · Guidance, not legal advice. Built with React, Node.js, Tailwind CSS, and local Ollama AI (llama3).
      </footer>
    </div>
  );
}
