# NyayaSaathi - Quick Start Guide

Get NyayaSaathi running on your machine in under 10 minutes.

## Prerequisites

Before you begin, install these tools:

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
2. **Ollama** - Download from [ollama.com](https://ollama.com)
   - Windows: Use the installer or `winget install Ollama.Ollama`
   - Mac: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.com/install.sh | sh`

## Step 1: Install and Start Ollama

```bash
# Pull the AI model (this downloads ~4GB, one-time only)
ollama pull llama3

# Verify it's running
ollama list
```

Ollama should now be running on `http://localhost:11434`

## Step 2: Clone and Setup Backend

```bash
# Navigate to the project
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm start
```

You should see: `NyayaSaathi backend running on port 5000`

**Note:** The `.env` file is pre-configured for local Ollama. No API keys needed!

## Step 3: Setup Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see: `Local: http://localhost:5173/`

## Step 4: Open the App

Open your browser and go to: **http://localhost:5173**

## Test the Application

Try these sample queries:

1. **Labor Issue:**
   > "My employer hasn't paid salary for 3 months. What can I do?"

2. **Consumer Complaint:**
   > "I ordered a phone online but received a damaged product. The seller is ignoring my emails."

3. **Cybercrime:**
   > "Someone is harassing me on Instagram. What legal steps can I take?"

## Key Features to Explore

✅ **Chat Interface** - Type your legal issue in plain language  
✅ **Follow-up Questions** - Click suggested questions for faster guidance  
✅ **Explain My Rights** - Button to get detailed rights explanation  
✅ **Safe Mode** - Toggle to prevent chat history from being saved  
✅ **Confidence Meter** - See AI confidence and adjust your own  
✅ **Journey Tracker** - Visual progress of your legal journey  
✅ **Document Generation** - Generate complaint letters and RTI applications (PDF + DOCX)  
✅ **Dark/Light Mode** - Toggle in header  

## Troubleshooting

### Backend won't start
- **Error:** "Ollama request failed"
  - **Fix:** Ensure Ollama is running: `ollama list`
  - Check `http://localhost:11434/api/tags` in browser

### Frontend shows "Failed to contact AI"
- **Fix:** Make sure backend is running on port 5000
- Check browser console for detailed errors
- Restart backend: Ctrl+C, then `npm start`

### Slow responses
- **Expected:** First query takes 10-30 seconds (model loading)
- **Normal:** Subsequent queries: 5-15 seconds depending on hardware
- **Improve:** Use a machine with GPU for faster inference

### JSON parsing errors
- **Fix:** Already handled in code. If persists, try `ollama pull llama3` again

## Stopping the Application

1. **Frontend:** Press `Ctrl + C` in the frontend terminal
2. **Backend:** Press `Ctrl + C` in the backend terminal
3. **Ollama:** (Optional) Ollama continues running in background

## Next Steps

- Read [README.md](README.md) for deployment instructions
- Explore the "Responsible AI" section in the app
- Customize prompts in `backend/src/prompts.js`
- Add more features as needed!

## Need Help?

- Check backend terminal for error logs
- Review `backend/.env` configuration
- Ensure ports 5000 and 5173 are available
- Try restarting all services

---

**Zero cloud costs. 100% local AI. Privacy-first legal guidance.**
