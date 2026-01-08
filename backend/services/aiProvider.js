const config = require('../src/config');

const SYSTEM_PROMPT = `You are NyayaSaathi, an AI assistant that provides legal and government process guidance only. You must not provide legal advice. Always include a disclaimer. Ask follow-up questions before generating documents. If uncertain, say "I may be mistaken." Use simple language.`;

async function callOllama(model, prompt) {
  const url = `${config.ollama.url.replace(/\/$/, '')}/api/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama request failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  if (!data?.response) throw new Error('Ollama response missing content');
  return data.response;
}

async function generateResponse(userPrompt) {
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;
  const primaryModel = config.ollama.model || 'llama3';
  const fallbackModel = config.ollama.fallbackModel || 'mistral';

  try {
    const response = await callOllama(primaryModel, fullPrompt);
    console.log('[AI Provider] Raw response:', response.substring(0, 200));
    return response;
  } catch (err) {
    console.error('[AI Provider] Primary model failed:', err.message);
    if (fallbackModel && fallbackModel !== primaryModel) {
      try {
        return await callOllama(fallbackModel, fullPrompt);
      } catch (fallbackErr) {
        throw new Error(`Ollama primary and fallback failed: ${fallbackErr.message}`);
      }
    }
    throw err;
  }
}

module.exports = {
  generateResponse
};
