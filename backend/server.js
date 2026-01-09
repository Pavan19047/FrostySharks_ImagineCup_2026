require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const config = require('./src/config');
// AI provider swapped to local Ollama (see services/aiProvider.js)
const { generateResponse } = require('./services/aiProvider');
const { chatPrompt, rightsPrompt, documentPrompt } = require('./src/prompts');
const { generateDocuments } = require('./src/utils/documentBuilder');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

if (config.app.allowLogging) {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    app: 'NyayaSaathi',
    aiProvider: config.aiProvider,
    ollamaUrl: config.ollama.url,
    ollamaModel: config.ollama.model
  });
});

// Test endpoint to verify Ollama connectivity
app.get('/test-ollama', async (_req, res) => {
  try {
    const { generateResponse } = require('./services/aiProvider');
    const testResponse = await generateResponse('Return JSON: {"test": "success", "confidence": 0.9}');
    res.json({ status: 'ok', rawResponse: testResponse.substring(0, 500) });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/chat', async (req, res) => {
  const { message, history = [], language = 'english', safeMode = config.app.safeModeDefault } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const context = {
      message,
      history,
      language,
      safeMode,
      expectation: 'Return JSON with reply, followUps, issueType, rightsSummary, nextSteps, confidence (0-1). Keep language simple.'
    };

    const raw = await generateResponse(chatPrompt(context));
    console.log('[Chat] Raw response length:', raw.length);
    
    // Extract JSON object by finding first { and last }
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in AI response');
    }
    const jsonStr = raw.substring(firstBrace, lastBrace + 1);
    
    const json = JSON.parse(jsonStr);
    
    // Normalize nextSteps: if object, convert to array
    let nextSteps = json.nextSteps || [];
    if (typeof nextSteps === 'object' && !Array.isArray(nextSteps)) {
      nextSteps = [
        nextSteps.whereToSubmit || '',
        nextSteps.expectedTimeline || '',
        nextSteps.documentsChecklist || ''
      ].filter(Boolean);
    }
    
    const response = {
      reply: `${json.reply || ''}\n\nDisclaimer: This is guidance, not legal advice.`.trim(),
      followUps: json.followUps || [],
      issueType: json.issueType || 'general',
      rightsSummary: json.rightsSummary || [],
      nextSteps,
      confidence: Number(json.confidence || 0.45)
    };

    if (!safeMode) {
      req.session.lastIssueType = response.issueType;
      req.session.confidence = response.confidence;
    }

    res.json(response);
  } catch (err) {
    console.error('[Chat] Error:', err.message);
    console.error('[Chat] Stack:', err.stack);
    res.status(500).json({
      error: 'Unable to get AI response. Please try again.',
      details: config.app.allowLogging ? err.message : undefined
    });
  }
});

app.post('/explain-rights', async (req, res) => {
  const { message, history = [], language = 'english' } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const context = { message, history, language };
    const raw = await generateResponse(rightsPrompt(context));
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in AI response');
    }
    const jsonStr = raw.substring(firstBrace, lastBrace + 1);
    const json = JSON.parse(jsonStr);
    res.json({
      rights: json.rights || json,
      confidence: Number(json.confidence || 0.5),
      disclaimer: 'This is guidance, not legal advice. I may be mistaken; please verify with a lawyer.'
    });
  } catch (err) {
    console.error('Rights error', err.message);
    res.status(500).json({ error: 'Unable to explain rights right now.' });
  }
});

app.post('/generate-document', async (req, res) => {
  const { type = 'complaint', details = {}, history = [] } = req.body || {};
  try {
    const context = { type, details, history };
    const raw = await generateResponse(documentPrompt(context));
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in AI response');
    }
    const jsonStr = raw.substring(firstBrace, lastBrace + 1);
    const draft = JSON.parse(jsonStr);
    const { pdfBuffer, docBuffer } = await generateDocuments(draft);

    res.json({
      draft,
      pdf: { filename: `${type}-draft.pdf`, data: pdfBuffer.toString('base64') },
      doc: { filename: `${type}-draft.docx`, data: docBuffer.toString('base64') }
    });
  } catch (err) {
    console.error('Document error', err.message);
    res.status(500).json({ error: 'Unable to generate document right now.' });
  }
});

app.post('/session', (req, res) => {
  const { email } = req.body || {};
  const userId = req.session.userId || uuidv4();
  req.session.userId = userId;
  if (email) req.session.email = email;
  res.json({ userId, email: req.session.email });
});

app.listen(config.port, () => {
  console.log(`NyayaSaathi backend running on port ${config.port}`);
});
