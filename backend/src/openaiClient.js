// Azure OpenAI client is disabled; retained as a stub for optional re-enable.
async function runJsonChat() {
  throw new Error('Azure OpenAI disabled. Use aiProvider.generateResponse instead.');
}

async function runTextChat() {
  throw new Error('Azure OpenAI disabled. Use aiProvider.generateResponse instead.');
}

module.exports = {
  runJsonChat,
  runTextChat
};
