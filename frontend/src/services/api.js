const BASE = '/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export function sendChat(payload) {
  return post('/chat', payload);
}

export function explainRights(payload) {
  return post('/explain-rights', payload);
}

export function generateDocument(payload) {
  return post('/generate-document', payload);
}

export function startSession(email) {
  return post('/session', { email });
}
