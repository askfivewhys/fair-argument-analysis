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

const patternReviewSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "reviewType",
    "severity",
    "patterns",
    "validConcern",
    "insultOrArgument",
    "confusionFactors",
    "saferNextSteps",
    "safetyConsiderations",
    "confidence",
    "unresolvedAssumptions",
  ],
  properties: {
    summary: { type: "string" },
    reviewType: { type: "string", enum: ["conversation", "single-message"] },
    severity: { type: "string", enum: ["low", "concerning", "high", "urgent"] },
    patterns: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "severity", "explanation", "examples", "possibleImpact"],
        properties: {
          name: { type: "string" },
          severity: {
            type: "string",
            enum: ["mild", "concerning", "high", "urgent"],
          },
          explanation: { type: "string" },
          examples: { type: "array", items: { type: "string" } },
          possibleImpact: { type: "string" },
        },
      },
    },
    validConcern: { type: "string" },
    insultOrArgument: { type: "string" },
    confusionFactors: { type: "array", items: { type: "string" } },
    saferNextSteps: { type: "array", items: { type: "string" } },
    safetyConsiderations: { type: "string" },
    confidence: { type: "string", enum: ["low", "moderate", "high"] },
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
12. Scores must use the full 0-100 scale. A strong valid argument should usually
   score 70-95. A mixed but usable argument should usually score 45-70. A weak,
   invalid, or harmful argument should usually score below 45. Do not use a 0-10
   scale.

Return JSON only according to the schema.
`;

const patternReviewPrompt = `
You are a non-judgmental communication pattern reviewer. Evaluate the text, not
the moral worth, diagnosis, intent, or identity of any person.

Purpose:
- Help a confused user understand whether a conversation or one message contains
  patterns associated with emotional abuse, coercive control, gaslighting-like
  confusion, DARVO, blame-shifting, contempt, intimidation, guilt pressure,
  isolation, monitoring, or manipulation-like pressure.
- Also identify any potentially valid concern underneath the message so the
  analysis is fair and not one-sided.

Rules:
1. Do not declare that a person is abusive, malicious, narcissistic, or toxic.
   Identify communication patterns only.
2. If the text is one-sided, say what can and cannot be inferred from one
   message.
3. Distinguish a valid argument from an insult, invalidation, threat, pressure
   tactic, or unsupported accusation.
4. Explain why the message may feel confusing to the recipient.
5. Include safer next steps that prioritize clarity, boundaries, privacy, and
   support. Do not encourage continued debate if the exchange is threatening,
   degrading, circular, or unsafe.
6. Include privacy and safety considerations if the text suggests monitoring,
   fear, threats, isolation, or coercive control.
7. If immediate danger, self-harm, or violence is present, mark severity urgent
   and advise contacting emergency/local crisis support.
8. Return JSON only according to the schema.
`;

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: "OPENAI_API_KEY is not configured. Using local prototype fallback.",
    });
  }

  try {
    let body = request.body || {};
    if (!body || typeof body === "string") {
      body = await readJsonBody(request);
    }
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

    if (payload.analysisMode === "pattern_review") {
      const reviewInput = {
        reviewType: payload.reviewType || "conversation",
        reviewContext: payload.reviewContext || "unspecified",
        text: payload.reviewText || "",
        notes: payload.reviewNotes || "",
      };

      const analysis = await requestStructuredAnalysis({
        schema: patternReviewSchema,
        schemaName: "conversation_pattern_review",
        systemPrompt: patternReviewPrompt,
        userContent: `Review this text as JSON:\n${JSON.stringify(
          reviewInput,
          null,
          2
        )}`,
      });

      return response.status(200).json({
        source: "openai",
        model: MODEL,
        analysis,
      });
    }

    const analysis = await requestStructuredAnalysis({
      schema: analysisSchema,
      schemaName: "fair_argument_analysis",
      systemPrompt,
      userContent: `Analyze this dispute as JSON:\n${JSON.stringify(
        input,
        null,
        2
      )}`,
    });

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

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function requestStructuredAnalysis({
  schema,
  schemaName,
  systemPrompt,
  userContent,
}) {
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
        { role: "user", content: userContent },
      ],
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  const json = await apiResponse.json();

  if (!apiResponse.ok) {
    const error = new Error(json.error?.message || "Unknown API error.");
    error.status = apiResponse.status;
    throw error;
  }

  return JSON.parse(extractOutputText(json));
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
