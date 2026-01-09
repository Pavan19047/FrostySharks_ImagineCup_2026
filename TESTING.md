# NyayaSaathi - Testing & Verification Guide

Use this guide to verify all features are working correctly.

## Pre-flight Checks

### 1. Backend Health Check
Open browser: http://localhost:5000/health

**Expected response:**
```json
{
  "status": "ok",
  "app": "NyayaSaathi",
  "aiProvider": "ollama",
  "ollamaUrl": "http://localhost:11434",
  "ollamaModel": "llama3"
}
```

### 2. Ollama Connectivity Test
Browser: http://localhost:5000/test-ollama

**Expected:** `{"status": "ok", "rawResponse": "..."}`

### 3. Frontend Health Check
Browser: http://localhost:5173

**Expected:** Landing page with "NyayaSaathi" logo, hero section, and "Start chatting" button

---

## Feature Testing Checklist

### ✅ Feature 1: Chat Interface

**Test Steps:**
1. Click "Start chatting" or scroll to chat section
2. Type: "My employer hasn't paid my salary for 3 months"
3. Click "Send"

**Expected Results:**
- User message appears in chat
- Loading indicator shows "Thinking..."
- AI response appears with:
  - Plain language reply
  - Disclaimer at the end
  - Issue type badge showing "Labor"
  - Follow-up question buttons (e.g., "Do you have a written employment contract?")

**Troubleshoot if fails:**
- Check browser console (F12) for errors
- Check backend terminal for "[Chat] Raw response length:" log
- Verify Ollama is running: `ollama list`

---

### ✅ Feature 2: Follow-Up Questions

**Test Steps:**
1. After AI responds, look for follow-up question buttons below chat input
2. Click one of the suggested questions

**Expected Results:**
- Question auto-fills and sends
- AI provides more specific guidance based on your answer
- New follow-ups appear (or none if AI has enough info)

**Troubleshoot:**
- If no follow-ups appear, check backend logs for `followUps` field in JSON response
- Ollama may need clearer prompting - this is expected behavior

---

### ✅ Feature 3: Explain My Rights

**Test Steps:**
1. After describing your issue, click "Explain my rights" button in chat panel
2. Wait for response (10-20 seconds)

**Expected Results:**
- Loading indicator appears
- Rights explanation appears in chat
- Rights summary section on the right sidebar populates with bullet points
- Journey tracker "Rights explained" step turns green

**Troubleshoot:**
- If error "Please describe your issue first" appears, send at least one message
- Check backend logs for "[Rights]" prefix
- Verify JSON parsing is extracting `rights` array correctly

---

### ✅ Feature 4: Journey Tracker

**Test Steps:**
1. Send a message → "Issue identified" turns green
2. Click "Explain my rights" → "Rights explained" turns green
3. Generate a document → "Document generated" turns green
4. Receive next steps → "Next steps suggested" turns green

**Expected Results:**
- Visual progress indicator
- Each completed step shows "Completed" status
- Pending steps show "Pending"

**Troubleshoot:**
- Check `journey` state in React DevTools
- Verify backend is returning proper metadata (issueType, nextSteps, etc.)

---

### ✅ Feature 5: Confidence Meter

**Test Steps:**
1. After AI responds, scroll to "Legal confidence meter" section
2. Observe AI confidence percentage (e.g., 68%)
3. Drag the user confidence slider

**Expected Results:**
- Progress bar shows AI confidence visually
- Slider starts at 50%
- Slider updates user confidence percentage in real-time

**Troubleshoot:**
- Check if `aiConfidence` value is being received from backend (0-1 scale)
- Verify it's multiplied by 100 for display

---

### ✅ Feature 6: Next-Step Recommendations

**Test Steps:**
1. After AI responds with guidance, scroll to "Next-step recommendations" card
2. Verify it's populated with actionable steps

**Expected Results:**
- List of where to submit complaint (e.g., "Labor Commissioner's office")
- Expected timeline (e.g., "2-3 months for hearing")
- Documents checklist (e.g., "Offer letter, bank statements")

**Troubleshoot:**
- If empty, check if backend is returning `nextSteps` as an array
- Look for normalization code that converts objects to arrays
- Ollama may need more context - ask a follow-up question first

---

### ✅ Feature 7: Document Generation (Complaint Letter)

**Test Steps:**
1. After conversation, scroll to "Auto legal document generator"
2. Click "Generate" under "Complaint letter"
3. Wait 15-30 seconds

**Expected Results:**
- Button shows "Generating..."
- "Download PDF" and "Download DOC" buttons appear
- Click "Download PDF" → PDF opens with:
  - Subject line
  - To: Concerned Authority
  - Body with conversation details
  - Relief requested
  - Sender details (or "Anonymous")
  - Documents checklist
  - Disclaimer at bottom

**Troubleshoot:**
- Check browser console for base64 decode errors
- Verify backend logs show "[Document]" prefix
- Check if `draft` object has required keys (subject, body, etc.)
- Ensure `pdfkit` and `docx` npm packages are installed

---

### ✅ Feature 8: Document Generation (RTI Application)

**Test Steps:**
1. Click "Generate" under "RTI application"
2. Download and open PDF/DOC

**Expected Results:**
- Similar to complaint letter but formatted for RTI
- Appropriate subject and body for information request

---

### ✅ Feature 9: Safe Mode

**Test Steps:**
1. Check "Safe mode (no history saved)" checkbox in chat panel
2. Send messages
3. Backend should not persist session data (check logs)

**Expected Results:**
- Checkbox toggles on/off
- When enabled, backend receives `safeMode: true` in request
- No session tracking in backend logs

**Troubleshoot:**
- Check network tab (F12) → POST /chat → Request Payload → `safeMode` field

---

### ✅ Feature 10: Language Selector

**Test Steps:**
1. Change language dropdown from "English" to "Hindi" or "Kannada"
2. Send a message

**Expected Results:**
- Dropdown updates
- Backend receives `language` parameter
- (Note: AI responses may still be in English if prompt isn't localized - this is a placeholder feature)

---

### ✅ Feature 11: Dark/Light Mode

**Test Steps:**
1. Click "Light mode" / "Dark mode" button in header
2. Observe UI theme change

**Expected Results:**
- Background switches between dark slate and light colors
- Text contrast adjusts

---

## Common Issues & Fixes

### Issue: "Failed to contact AI" error

**Cause:** Backend not running or Ollama not responding

**Fix:**
```bash
# Check backend
cd backend
npm start

# Check Ollama
ollama list
ollama serve
```

### Issue: "Unexpected token 'H'" JSON parse error

**Cause:** Ollama adding explanatory text before JSON

**Fix:** Already handled by extracting JSON between first `{` and last `}`

### Issue: Slow responses (30+ seconds)

**Cause:** Hardware limitations or model loading

**Fix:**
- First query always slow (model loads into memory)
- Subsequent queries should be faster
- Consider switching to `mistral` model if llama3 is too slow: `ollama pull mistral`
- Update `backend/.env`: `OLLAMA_MODEL=mistral`

### Issue: Document download doesn't work

**Cause:** Base64 decode error or missing data

**Fix:**
- Check browser console for Blob/URL creation errors
- Verify backend response has `pdf.data` and `doc.data` fields
- Try generating after a longer conversation

### Issue: Rights summary not populating

**Cause:** Backend returning object instead of array

**Fix:**
- Check backend response structure
- Verify frontend is converting `data.rights` to array if needed

---

## Manual Backend Tests (via terminal)

### Test Chat Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message":"My salary is not paid","language":"english","safeMode":false}'
```

**Expected:** JSON with `reply`, `followUps`, `issueType`, `rightsSummary`, `nextSteps`, `confidence`

### Test Rights Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/explain-rights" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message":"Explain my rights","history":[],"language":"english"}'
```

**Expected:** JSON with `rights` array, `confidence`, `disclaimer`

### Test Document Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/generate-document" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"type":"complaint","history":[{"role":"user","content":"Salary not paid"}]}'
```

**Expected:** JSON with `draft`, `pdf`, `doc` objects

---

## Performance Benchmarks

| Operation | Expected Time | Acceptable Range |
|-----------|---------------|------------------|
| First query | 10-30s | Up to 60s on slow hardware |
| Subsequent queries | 5-15s | Up to 30s |
| Rights explanation | 10-20s | Up to 40s |
| Document generation | 15-30s | Up to 60s |

---

## Success Criteria

✅ All chat messages send and receive responses  
✅ Follow-up questions appear and are clickable  
✅ Rights explanations populate sidebar and chat  
✅ Journey tracker updates correctly  
✅ Confidence meter displays and is adjustable  
✅ Next steps populate with actionable info  
✅ Documents generate and download successfully  
✅ Safe mode toggles correctly  
✅ No console errors (except expected warnings)  
✅ All features work across 3 test scenarios

---

## Deployment Readiness Checklist

Before deploying to production:

- [ ] All features tested and working locally
- [ ] Environment variables documented
- [ ] README.md updated with deployment steps
- [ ] .gitignore excludes .env and node_modules
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors
- [ ] Ollama model is accessible (or cloud VM configured)
- [ ] CORS settings adjusted for production domains
- [ ] Secure session secret in production .env
- [ ] Logging is configurable (ALLOW_LOGGING)
- [ ] Error messages are user-friendly
- [ ] Disclaimers are visible on all AI outputs

---

**If any feature fails, check:**
1. Browser console (F12 → Console)
2. Network tab (F12 → Network → failed requests)
3. Backend terminal logs
4. Ollama status (`ollama list`, `ollama ps`)
5. This testing guide troubleshooting sections
