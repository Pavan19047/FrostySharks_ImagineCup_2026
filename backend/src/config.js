module.exports = {
  port: process.env.PORT || 5000,
  sessionSecret: process.env.SESSION_SECRET || 'dev-nyayasaathi-secret',
  aiProvider: process.env.AI_PROVIDER || 'ollama',
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3',
    fallbackModel: process.env.OLLAMA_FALLBACK_MODEL || 'mistral'
  },
  // Azure configuration retained for optional future use (disabled by default)
  azure: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview'
  },
  app: {
    allowLogging: process.env.ALLOW_LOGGING !== 'false',
    safeModeDefault: process.env.SAFE_MODE_DEFAULT === 'true'
  }
};
