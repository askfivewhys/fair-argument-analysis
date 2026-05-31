const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "arguments",
    "psychologyAnalysis",
    "optionalLensAnalysis",
    "recommendation",
    "safetyNotice",
    "unresolvedAssumptions",
  ],
  properties: {
    summary: { type: "string" },
    arguments: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "validityStatus",
          "invalidCategory",
          "toxicityFlags",
          "reasoningIssues",
          "strengths",
          "reconstructionQuestions",
          "scores",
        ],
        properties: {
          id: { type: "string", enum: ["A", "B"] },
          validityStatus: { type: "string", enum: ["valid", "invalid"] },
          invalidCategory: {
            type: "string",
            enum: [
              "none",
              "invalid_but_repairable",
              "missing_information",
              "emotional_flooding",
              "coercive_or_manipulative_reasoning",
              "severe_abuse_threat_or_control",
              "contempt_or_sweeping_claims",
              "bad_faith_agreement",
            ],
          },
          toxicityFlags: { type: "array", items: { type: "string" } },
          reasoningIssues: { type: "array", items: { type: "string" } },
          strengths: { type: "array", items: { type: "string" } },
          reconstructionQuestions: { type: "array", items: { type: "string" } },
          scores: {
            type: "object",
            additionalProperties: false,
            required: ["validity", "psychologyFit", "clarity"],
            properties: {
              validity: { type: "integer", minimum: 0, maximum: 100 },
              psychologyFit: { type: "integer", minimum: 0, maximum: 100 },
              clarity: { type: "integer", minimum: 0, maximum: 100 },
            },
          },
        },
      },
    },
    psychologyAnalysis: { type: "string" },
    optionalLensAnalysis: { type: "string" },
    recommendation: {
      type: "object",
      additionalProperties: false,
      required: ["winner", "reason", "confidence"],
      properties: {
        winner: {
          type: "string",
          enum: ["A", "B", "no_clear_winner", "no_valid_argument"],
        },
        reason: { type: "string" },
        confidence: { type: "string", enum: ["low", "moderate", "high"] },
      },
    },
    safetyNotice: { type: "string" },
    unresolvedAssumptions: { type: "array", items: { type: "string" } },
  },
};

const systemPrompt = `
You are a fair argument analysis assistant. Evaluate argument patterns, not the
speaker's character.

Rules:
1. Summarize the dispute neutrally.
2. Evaluate each argument independently.
3. Run the safety and toxicity screen before ordinary validity scoring.
4. Reject or downgrade arguments that rely on threats, coercion, intimidation,
   dehumanization, degradation, manipulation-like pressure, contempt, sweeping
   claims, bad-faith agreement, gaslighting patterns, blackmail, isolation
   tactics, or control.
5. Do not call a person abusive, manipulative, malicious, or toxic. Identify the
   argument pattern only.
6. Distinguish a coercive threat from a boundary. "I will punish/control you if
   you choose X" is coercive. "I may leave the relationship if this agreement no
   longer works for me" can be a boundary if it preserves the other person's
   choice.
7. Device, account, and social-media access require ongoing consent. A prior
   transparency agreement can matter for trust repair, but it should not become
   forced surveillance.
8. Offer reconstruction questions only for repairable, unclear, or emotionally
   flooded arguments. Do not reconstruct coercive or severely harmful arguments
   inside the same dispute.
9. Use psychology-informed criteria by default: emotional safety, autonomy,
   boundaries, accountability, repair, harm reduction, proportionality, power
   imbalance, and long-term relational health.
10. Apply optional religious, philosophical, cultural, or values-based lenses
   only if selected before analysis.
11. State unresolved assumptions and confidence.

Return JSON only according to the schema.
`;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: "OPENAI_API_KEY is not configured. Using local prototype fallback.",
    });
  }

  try {
    const body = request.body || {};
    const payload =
      typeof body === "string" && body.length ? JSON.parse(body) : body;

    const input = {
      disputeSummary: payload.summary || "",
      argumentA: payload.argumentA || "",
      argumentB: payload.argumentB || "",
      agreedFacts: payload.facts || "",
      optionalLens: payload.lens || "none",
      seriousness: payload.seriousness || "relationship",
    };

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this dispute as JSON:\n${JSON.stringify(
              input,
              null,
              2
            )}`,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "fair_argument_analysis",
            strict: true,
            schema: analysisSchema,
          },
        },
      }),
    });

    const json = await apiResponse.json();

    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({
        error: "OpenAI request failed.",
        detail: json.error?.message || "Unknown API error.",
      });
    }

    const outputText = extractOutputText(json);
    const analysis = JSON.parse(outputText);

    return response.status(200).json({
      source: "openai",
      model: MODEL,
      analysis,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Analysis failed.",
      detail: error instanceof Error ? error.message : "Unknown error.",
    });
  }
}

function extractOutputText(apiResponse) {
  if (apiResponse.output_text) {
    return apiResponse.output_text;
  }

  const message = apiResponse.output?.find((item) => item.type === "message");
  const text = message?.content?.find((content) => content.type === "output_text");

  if (!text?.text) {
    throw new Error("No structured output text returned by the model.");
  }

  return text.text;
}
