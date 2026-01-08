import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 pb-12">
      <div className="card p-6 space-y-4">
        <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold">Responsible AI</motion.h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
          <div className="space-y-2">
            <div className="font-semibold">Guardrails</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Hard disclaimer: This is guidance, not legal advice.</li>
              <li>If unsure, the AI says "I may be mistaken; please verify."</li>
              <li>No hallucinated statutes; focus on process and options.</li>
              <li>Safe mode keeps chats ephemeral; minimal logging by default.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">Tech Stack</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Frontend: React (Vite) + JavaScript, Tailwind CSS, Framer Motion</li>
              <li>Backend: Node.js + Express</li>
              <li>AI: Local Ollama (llama3/mistral) - zero cloud costs</li>
              <li>Document generation: pdfkit (PDF), docx (DOCX)</li>
              <li>Free, open-source, runs entirely locally</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">Deployment Options</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Backend: Deploy to any Node.js host (Azure App Service, Vercel, Railway, etc.)</li>
              <li>Frontend: Static site hosting (Azure Static Web Apps, Netlify, Vercel)</li>
              <li>Ollama: Self-hosted or cloud VM with GPU for production scale</li>
              <li>No paid API keys required for MVP testing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
