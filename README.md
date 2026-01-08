# NyayaSaathi

AI-powered legal and government aid assistant for citizens. Tech stack: React (Vite, JS), Tailwind CSS + Framer Motion, Node.js + Express, **Local Ollama AI (llama3/mistral)**. Zero cloud AI costs. Fully deployable.

## Features
- Multilingual chat with guided follow-up questions (English + placeholder regional languages)
- Issue type detection (labor, consumer, cybercrime, RTI, general)
- Plain-language rights explanation with disclaimers
- Legal confidence meter (AI + user feedback)
- Smart next-step recommendations (where to submit, timelines, documents)
- Safe mode (no history saved, minimal logging)
- Auto document generation (complaint, RTI) with PDF + DOC downloads
- Journey tracker (issue -> rights -> document -> next steps)

## Repo structure
```
backend/   Express APIs + Local Ollama AI + doc generation (PDF/DOCX)
frontend/  Vite React app (Tailwind + Framer Motion)
```

## Prerequisites
- Node.js 18+
- **Ollama** installed locally (https://ollama.com) with `llama3` or `mistral` model pulled

## Backend setup
```bash
cd backend
cp .env.example .env
# Fill env values
npm install
npm start
```

### Env vars (.env)
- `AI_PROVIDER` = ollama (default)
- `OLLAMA_URL` = http://localhost:11434 (default)
- `OLLAMA_MODEL` = llama3 (or mistral)
- `OLLAMA_FALLBACK_MODEL` = mistral (optional)
- `PORT` = 5000 (default)
- `SESSION_SECRET` = random string
- `ALLOW_LOGGING` = true/false
- `SAFE_MODE_DEFAULT` = true/false

*Azure OpenAI env vars are retained in config for optional future use but not required.*

### API routes
- `POST /chat` → { message, history?, language?, safeMode? }
- `POST /explain-rights` → { message, history?, language? }
- `POST /generate-document` → { type: complaint|rti, details?, history? }
- `POST /session` → lightweight session/email capture

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Vite dev server proxies `/api` to `http://localhost:5000`.

## Deployment (Production)
1. **Backend**: Deploy to any Node.js host (Azure App Service, Railway, Render, Vercel serverless functions, etc.). Set env vars from `.env` in hosting config.
2. **Frontend**: Build with `npm run build` (outputs `dist/`). Serve via Azure Static Web Apps, Netlify, Vercel, or copy to backend's public folder.
3. **Ollama**: For production, host Ollama on a cloud VM (Azure, AWS, GCP) with GPU support. Update `OLLAMA_URL` to point to remote instance.
4. **CORS**: If frontend is on different domain, adjust CORS settings in backend.

*No paid AI API keys required. Ollama is free and open-source.*

## Sample test prompts
- "My employer hasn’t paid salary for 2 months. What can I do?"
- "My online order was never delivered and the company ignores emails."
- "Someone is harassing me on Instagram; what steps can I take?"
- "I need to file an RTI about a delayed service connection." 

## Responsible AI notes
- Always shows disclaimer: guidance, not legal advice.
- Model instructed to admit uncertainty: "I may be mistaken; please verify with a lawyer."
- Avoids hallucinated statutes; focuses on process and options.
- Safe mode minimizes logging; no persistence layer is used.

## Document generation
The backend uses **local Ollama AI** to draft structured content, then renders PDF (pdfkit) and DOCX (docx). Responses return base64; the frontend turns them into downloadable links. No external API calls or costs.

## Running both locally
- Start backend: `npm start` in `backend`
- Start frontend: `npm run dev` in `frontend`
- Open http://localhost:5173

## Limitations
- No database; sessions are in-memory (restart clears state).
- Regional language support is placeholder pending localized prompting.
- Ollama response times depend on local hardware (GPU recommended for production).

## Security
- No API keys needed for Ollama (runs locally).
- Use HTTPS in production; set secure cookies if using real auth.
- For production Ollama deployment, secure the endpoint with authentication.

## Accessibility & UX
- Responsive layout, dark/light toggle, clear typography (Space Grotesk).
- Animations kept subtle via Framer Motion.
