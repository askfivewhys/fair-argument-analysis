module.exports = function handler(request, response) {
  response.status(200).json({
    ok: true,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  });
};
