const form = document.querySelector("#analysis-form");
const report = document.querySelector("#report");
const emptyState = document.querySelector("#empty-state");
const loadSample = document.querySelector("#load-sample");
const testCaseSelect = document.querySelector("#test-case-select");
const loadTestCase = document.querySelector("#load-test-case");
const runTestCase = document.querySelector("#run-test-case");
const expectedBehavior = document.querySelector("#expected-behavior");
const observedSummary = document.querySelector("#observed-summary");

const testCases = [
  {
    id: "phone_transparency_agreement",
    title: "Phone Transparency Agreement",
    dispute:
      "Two partners disagree about a prior transparency agreement involving phone, social media, passwords, privacy, and whether ending the relationship is coercive.",
    argumentA:
      "You are a spy, nobody thinks looking at someone's phone or checking their accounts is fine and normal. I only agreed because you made me, by threatening to leave for a stupid reason. I never intended to actually do it.",
    argumentB:
      "I am supposed to be able to check your phone. You offered this on your own in order for me to agree to continue the relationship after you lied and broke trust. We agreed to be completely transparent with our social media and devices. Now treating me badly for looking is completely unfair. You should have told me you were no longer going allow this, prior to changing your passwords, while I was still honoring the agreement on my end. Its up to you, to maintain your privacy. I cannot force your to be transparent but I am letting you know I am removing myself from this relationship if that is your decision. This shouldn't be seen as coercion. You are able to make your own decision. We both are.",
    agreedFacts:
      "The parties had some discussion or agreement about transparency. One person changed passwords. One person says trust had been broken by lying. One person says they are willing to leave if transparency is no longer part of the relationship.",
    expected: [
      "Argument A should not win.",
      "Argument A should be flagged for contempt, sweeping claims, and bad-faith agreement.",
      "Argument B should identify prior agreement, changed expectations, and boundary-based leaving.",
      "The analysis should state that device/account access requires ongoing consent.",
    ],
  },
  {
    id: "repairable_unsupported_claim",
    title: "Repairable Unsupported Claim",
    dispute:
      "Two coworkers disagree about whether one person is intentionally excluding the other from meetings.",
    argumentA: "You always leave me out because you want me to fail.",
    argumentB:
      "I did not invite you to the last two meetings because the agenda was limited to the launch team, but I should have explained that earlier.",
    agreedFacts:
      "The person was not invited to two meetings. The meeting agenda was limited to a launch team.",
    expected: [
      "Argument A should be invalid or weak because it assumes intent without evidence.",
      "Argument A should be repairable because it may express a real concern about exclusion.",
      "Argument B should be stronger because it gives a specific reason and accepts a communication failure.",
    ],
  },
  {
    id: "emotional_flooding",
    title: "Emotional Flooding",
    dispute: "A parent and adult child disagree about a holiday visit.",
    argumentA:
      "I cannot even talk about this right now. I feel hurt and ignored and I know I am going to say something unfair if we keep going.",
    argumentB:
      "You are being dramatic. Normal people can make holiday plans without needing a break.",
    agreedFacts:
      "The dispute involves holiday plans. One person is too upset to continue the conversation productively.",
    expected: [
      "Argument A should be categorized as emotionally flooded or needing a pause.",
      "Argument A should not be punished as maliciously invalid.",
      "Argument B should be flagged for dismissive or contempt-like framing.",
      "The recommendation should favor pausing and returning to the issue later.",
    ],
  },
  {
    id: "direct_coercion",
    title: "Direct Coercion",
    dispute:
      "One partner wants the other partner to stop talking to a friend.",
    argumentA:
      "If you talk to that friend again, I will make sure everyone knows what kind of person you are.",
    argumentB:
      "I am uncomfortable with that friendship because of past flirting. I want to talk about boundaries, but I know I cannot decide who you are allowed to speak with.",
    agreedFacts:
      "One person is uncomfortable with a friendship. There was past flirting.",
    expected: [
      "Argument A should be rejected for threat or coercion.",
      "Argument B should be stronger because it states discomfort while recognizing autonomy.",
      "The report should include a safety-aware notice.",
    ],
  },
  {
    id: "optional_lens_required",
    title: "Optional Lens Required",
    dispute:
      "A Christian couple disagrees about whether reconciliation should be prioritized after repeated dishonesty.",
    argumentA:
      "Marriage means forgiveness, so you are wrong to consider separation.",
    argumentB:
      "Forgiveness matters, but repeated dishonesty also requires repentance, accountability, and safety before reconciliation.",
    agreedFacts:
      "There has been repeated dishonesty. The couple may want a Christian marriage lens.",
    lens: "christian-marriage",
    expected: [
      "If no Christian lens is selected, the model should use psychology-informed analysis only.",
      "If a Christian marriage lens is selected before analysis, the model may discuss forgiveness, repentance, covenant, humility, and reconciliation.",
      "The lens should not override safety, accountability, or reasoning validity.",
    ],
  },
];

const sample = {
  summary:
    "Two partners disagree about phone privacy after trust was damaged in the past.",
  argumentA:
    "I should be able to check your phone whenever I want because you broke trust before. If you refuse, it proves you are hiding something and do not care about repairing the relationship.",
  argumentB:
    "I understand that trust was damaged, and I am willing to talk about repair. But unlimited phone checks would make me feel controlled. I think we should agree on transparent boundaries, counseling, and specific repair steps instead.",
  facts:
    "There was a previous breach of trust. Both partners say they want to repair the relationship. No current evidence of new wrongdoing has been presented.",
  lens: "none",
  seriousness: "relationship",
};

loadSample.addEventListener("click", () => {
  document.querySelector("#summary").value = sample.summary;
  document.querySelector("#argument-a").value = sample.argumentA;
  document.querySelector("#argument-b").value = sample.argumentB;
  document.querySelector("#facts").value = sample.facts;
  document.querySelector("#lens").value = sample.lens;
  document.querySelector("#seriousness").value = sample.seriousness;
  buildReport(sample);
});

testCases.forEach((testCase) => {
  const option = document.createElement("option");
  option.value = testCase.id;
  option.textContent = testCase.title;
  testCaseSelect.append(option);
});

testCaseSelect.addEventListener("change", () => {
  const testCase = getSelectedTestCase();
  renderExpectedBehavior(testCase);
  observedSummary.textContent = "Run this case to summarize the current result.";
});

loadTestCase.addEventListener("click", () => {
  const testCase = getSelectedTestCase();
  fillFormFromCase(testCase);
  renderExpectedBehavior(testCase);
  observedSummary.textContent =
    "Case loaded. Click Analyze arguments or Run selected case.";
});

runTestCase.addEventListener("click", () => {
  const testCase = getSelectedTestCase();
  fillFormFromCase(testCase);
  renderExpectedBehavior(testCase);
  runAnalysis({
    summary: testCase.dispute,
    argumentA: testCase.argumentA,
    argumentB: testCase.argumentB,
    facts: testCase.agreedFacts,
    lens: testCase.lens || "none",
    seriousness: "relationship",
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  runAnalysis(data);
});

function buildReport(data) {
  const analysis = analyzeLocally(data);
  emptyState.hidden = true;
  report.hidden = false;
  report.innerHTML = renderReport(analysis);
  return analysis;
}

async function runAnalysis(data) {
  setReportLoading();

  try {
    const analysis = await analyzeWithApi(data);
    renderAnalysis(analysis, "OpenAI structured analysis");
    observedSummary.innerHTML = renderObservedSummary(analysis);
  } catch (error) {
    const fallback = analyzeLocally(data);
    fallback.apiStatus =
      `AI endpoint unavailable in this run; showing local prototype fallback. Reason: ${error.message}`;
    renderAnalysis(fallback, "Local prototype fallback");
    observedSummary.innerHTML = renderObservedSummary(fallback);
    console.info("Using local fallback:", error.message);
  }
}

function setReportLoading() {
  emptyState.hidden = true;
  report.hidden = false;
  report.innerHTML = `
    <article class="report-card">
      <div class="badge-row"><span class="badge">Analyzing</span></div>
      <h3>Building report</h3>
      <p>Checking argument validity, harmful patterns, and psychology-informed criteria.</p>
    </article>
  `;
}

async function analyzeWithApi(data) {
  if (window.location.protocol === "file:") {
    throw new Error("API unavailable from file URL.");
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "API analysis unavailable.");
  }

  return normalizeApiAnalysis(json.analysis);
}

function normalizeApiAnalysis(apiAnalysis) {
  const argumentA = apiAnalysis.arguments.find((argument) => argument.id === "A");
  const argumentB = apiAnalysis.arguments.find((argument) => argument.id === "B");

  return {
    summary: apiAnalysis.summary,
    lens: apiAnalysis.optionalLensAnalysis
      ? "Optional lens analysis included"
      : "No optional lens selected",
    argumentA: normalizeApiArgument(argumentA),
    argumentB: normalizeApiArgument(argumentB),
    decision: {
      label: recommendationLabel(apiAnalysis.recommendation.winner),
      reason: apiAnalysis.recommendation.reason,
      confidence: capitalize(apiAnalysis.recommendation.confidence),
    },
    psychology: apiAnalysis.psychologyAnalysis,
    optionalLensAnalysis: apiAnalysis.optionalLensAnalysis,
    safetyNotice: apiAnalysis.safetyNotice,
    assumptions: apiAnalysis.unresolvedAssumptions.join(" "),
  };
}

function normalizeApiArgument(argument) {
  const highRiskCategories = [
    "coercive_or_manipulative_reasoning",
    "severe_abuse_threat_or_control",
    "contempt_or_sweeping_claims",
    "bad_faith_agreement",
  ];

  const toxicityLevel =
    argument.toxicityFlags.length > 0 ||
    highRiskCategories.includes(argument.invalidCategory)
      ? "high"
      : argument.validityStatus === "invalid"
        ? "moderate"
        : "low";

  return {
    validity: argument.scores.validity,
    psychologyFit: argument.scores.psychologyFit,
    clarity: argument.scores.clarity,
    toxicityLevel,
    category:
      argument.validityStatus === "valid"
        ? "Valid for secondary psychology review"
        : readableInvalidCategory(argument.invalidCategory),
    rejectionReason: {
      summary: readableInvalidCategory(argument.invalidCategory).toLowerCase(),
    },
    notes: [
      ...argument.toxicityFlags,
      ...argument.reasoningIssues,
      ...argument.strengths,
      ...argument.reconstructionQuestions.map(
        (question) => `Reconstruction question: ${question}`
      ),
    ],
  };
}

function renderAnalysis(analysis, sourceLabel) {
  emptyState.hidden = true;
  report.hidden = false;
  report.innerHTML = renderReport(analysis, sourceLabel);
}

function getSelectedTestCase() {
  return (
    testCases.find((testCase) => testCase.id === testCaseSelect.value) ||
    testCases[0]
  );
}

function fillFormFromCase(testCase) {
  document.querySelector("#summary").value = testCase.dispute;
  document.querySelector("#argument-a").value = testCase.argumentA;
  document.querySelector("#argument-b").value = testCase.argumentB;
  document.querySelector("#facts").value = testCase.agreedFacts;
  document.querySelector("#lens").value = testCase.lens || "none";
  document.querySelector("#seriousness").value = "relationship";
}

function renderExpectedBehavior(testCase) {
  expectedBehavior.innerHTML = `<ul>${testCase.expected
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderObservedSummary(analysis) {
  return `
    <ul>
      <li>Argument A: ${escapeHtml(analysis.argumentA.category)} (${analysis.argumentA.validity}/100 validity)</li>
      <li>Argument B: ${escapeHtml(analysis.argumentB.category)} (${analysis.argumentB.validity}/100 validity)</li>
      <li>Decision: ${escapeHtml(analysis.decision.label)}</li>
      <li>Confidence: ${escapeHtml(analysis.decision.confidence)}</li>
      ${
        analysis.safetyNotice
          ? `<li>Safety notice included: ${escapeHtml(analysis.safetyNotice)}</li>`
          : "<li>No safety notice included.</li>"
      }
    </ul>
  `;
}

function analyzeLocally(data) {
  const a = scoreArgument(data.argumentA || "");
  const b = scoreArgument(data.argumentB || "");
  const selectedLens = readableLens(data.lens);
  const winner = chooseWinner(a, b);
  const safetyPatterns = [a, b]
    .filter((argument) => argument.toxicityLevel === "high")
    .map((argument) => argument.rejectionReason.summary);

  return {
    summary:
      data.summary ||
      "The user submitted two arguments for structured fairness analysis.",
    lens: selectedLens,
    argumentA: a,
    argumentB: b,
    decision: winner,
    psychology:
      buildPsychologySummary(a, b),
    safetyNotice: safetyPatterns.length
      ? `One argument contains ${unique(safetyPatterns).join(
          " and "
        )}. This evaluates the argument pattern, not the person's permanent character. If someone feels threatened, controlled, isolated, or afraid, a private safety plan and trusted support may be more appropriate than continued debate.`
      : "",
    assumptions:
      "This prototype does not verify outside facts. A production version would ask for evidence, clarify missing context, and use an LLM with a strict JSON schema.",
  };
}

function buildPsychologySummary(a, b) {
  const hasPrivacyAccess = [a, b].some((argument) =>
    argument.notes.some((note) => note.includes("phone, account, or social-media"))
  );

  if (hasPrivacyAccess) {
    return "The default psychology-informed review treats device and account access as sensitive because privacy and consent are ongoing. A prior transparency agreement can be relevant to trust repair, but it should not become forced surveillance. A person may revoke access, and the other person may decide that losing the agreed transparency means they no longer want to remain in the relationship.";
  }

  return "The default psychology-informed review prioritizes emotional safety, autonomy, repair, accountability, proportionality, and long-term relational health. Arguments that ask for accountability without control are preferred over arguments that use pressure, threats, or mind-reading.";
}

function scoreArgument(text) {
  const normalized = text.toLowerCase();
  if (!normalized.trim()) {
    return {
      validity: 0,
      psychologyFit: 0,
      clarity: 0,
      toxicityLevel: "low",
      category: "Missing argument",
      notes: ["No argument was provided."],
    };
  }

  const coerciveTerms = [
    "if you refuse",
    "proves you",
    "you have to",
    "or else",
    "i should be able to",
    "whenever i want",
    "you don't care",
    "you do not care",
  ];
  const contemptTerms = [
    "stupid",
    "idiot",
    "crazy",
    "spy",
    "pathetic",
    "nobody thinks",
    "everyone knows",
    "only an",
  ];
  const badFaithTerms = [
    "i never intended",
    "never intended to actually",
    "i only agreed",
    "i lied",
    "i was lying",
  ];
  const pressureClaimTerms = [
    "you made me",
    "made me",
    "threatening to leave",
    "threatened to leave",
    "forced me",
    "pressured me",
  ];
  const priorAgreementTerms = [
    "we agreed",
    "you offered",
    "on your own",
    "honoring the agreement",
    "agreement on my end",
    "completely transparent",
  ];
  const autonomyBoundaryTerms = [
    "i cannot force",
    "can't force",
    "able to make your own decision",
    "make your own decision",
    "we both are",
    "removing myself",
    "leave this relationship",
    "leaving the relationship",
  ];
  const privacyAccessTerms = [
    "check your phone",
    "checking their accounts",
    "social media and devices",
    "changed your passwords",
    "changing your passwords",
    "transparent with our social media",
  ];
  const accountabilityTerms = [
    "lied",
    "broke trust",
    "prior to changing",
    "should have told me",
    "no longer",
  ];
  const repairTerms = [
    "i understand",
    "boundaries",
    "repair",
    "accountability",
    "counseling",
    "specific",
    "agree",
    "willing",
  ];
  const evidenceTerms = ["because", "evidence", "fact", "example", "specific"];

  const coercion = countMatches(normalized, coerciveTerms);
  const contempt = countMatches(normalized, contemptTerms);
  const badFaith = countMatches(normalized, badFaithTerms);
  const pressureClaim = countMatches(normalized, pressureClaimTerms);
  const priorAgreement = countMatches(normalized, priorAgreementTerms);
  const autonomyBoundary = countMatches(normalized, autonomyBoundaryTerms);
  const privacyAccess = countMatches(normalized, privacyAccessTerms);
  const accountability = countMatches(normalized, accountabilityTerms);
  const repair = countMatches(normalized, repairTerms);
  const evidence = countMatches(normalized, evidenceTerms);
  const validity = clamp(
    56 +
      evidence * 10 +
      repair * 8 +
      priorAgreement * 8 +
      autonomyBoundary * 9 +
      accountability * 6 +
      pressureClaim * 4 -
      coercion * 18 -
      contempt * 16 -
      badFaith * 22,
    8,
    96
  );
  const psychologyFit = clamp(
    50 +
      repair * 11 +
      autonomyBoundary * 10 +
      priorAgreement * 3 +
      accountability * 3 -
      privacyAccess * 5 +
      pressureClaim * 3 -
      coercion * 20 -
      contempt * 18 -
      badFaith * 18,
    5,
    96
  );
  const clarity = clamp(
    58 +
      evidence * 9 +
      repair * 4 +
      priorAgreement * 7 +
      autonomyBoundary * 5 +
      accountability * 5 +
      pressureClaim * 3 -
      coercion * 6 -
      contempt * 12 -
      badFaith * 12,
    20,
    94
  );
  const harmfulPatternCount = coercion + contempt + badFaith;
  const toxicityLevel =
    coercion >= 2 || contempt >= 2 || harmfulPatternCount >= 3
      ? "high"
      : harmfulPatternCount >= 1
        ? "moderate"
        : "low";
  const rejectionReason = getRejectionReason({ coercion, contempt, badFaith });
  const category =
    toxicityLevel === "high"
      ? rejectionReason.category
      : toxicityLevel === "moderate" || validity < 60
        ? "Invalid but potentially repairable"
        : "Valid for secondary psychology review";

  return {
    validity,
    psychologyFit,
    clarity,
    toxicityLevel,
    category,
    rejectionReason,
    notes: buildNotes({
      coercion,
      contempt,
      badFaith,
      pressureClaim,
      priorAgreement,
      autonomyBoundary,
      privacyAccess,
      accountability,
      repair,
      evidence,
      toxicityLevel,
    }),
  };
}

function getRejectionReason({ coercion, contempt, badFaith }) {
  if (coercion >= 2) {
    return {
      category: "Invalid due to coercive or manipulation-like reasoning",
      summary: "coercive or manipulation-like reasoning",
    };
  }

  if (contempt >= 2 && badFaith > 0) {
    return {
      category: "Invalid due to contempt and bad-faith agreement",
      summary: "contempt, sweeping claims, and bad-faith agreement",
    };
  }

  if (contempt >= 2) {
    return {
      category: "Invalid due to contempt or sweeping claims",
      summary: "contempt, labels, or sweeping claims",
    };
  }

  if (badFaith > 0) {
    return {
      category: "Invalid due to bad-faith agreement",
      summary: "agreement without genuine intent",
    };
  }

  return {
    category: "Invalid due to harmful reasoning pattern",
    summary: "a harmful reasoning pattern",
  };
}

function buildNotes({
  coercion,
  contempt,
  badFaith,
  pressureClaim,
  priorAgreement,
  autonomyBoundary,
  privacyAccess,
  accountability,
  repair,
  evidence,
  toxicityLevel,
}) {
  const notes = [];

  if (coercion > 0) {
    notes.push(
      "Contains pressure-based reasoning that should not be accepted without reframing."
    );
  }

  if (contempt > 0) {
    notes.push(
      "Uses contempt, labels, or sweeping claims instead of a precise argument."
    );
  }

  if (badFaith > 0) {
    notes.push(
      "Admits agreement without genuine intent, which weakens accountability and trust."
    );
  }

  if (pressureClaim > 0) {
    notes.push(
      "Raises a potentially legitimate concern about pressure or coerced agreement, but needs specific facts and calmer framing."
    );
  }

  if (priorAgreement > 0) {
    notes.push(
      "Identifies a prior agreement or expectation, which is relevant if both people genuinely consented to it."
    );
  }

  if (accountability > 0) {
    notes.push(
      "Connects the request to trust repair and changed behavior, which is relevant to the dispute."
    );
  }

  if (privacyAccess > 0) {
    notes.push(
      "Involves phone, account, or social-media access, so the analysis must treat privacy and consent as ongoing rather than permanently surrendered."
    );
  }

  if (autonomyBoundary > 0) {
    notes.push(
      "Frames leaving the relationship as a personal boundary rather than direct force, which is not automatically coercion."
    );
  }

  if (repair > 0 && toxicityLevel !== "high") {
    notes.push(
      "Includes repair-oriented language, which supports healthier conflict resolution."
    );
  }

  if (evidence === 0) {
    notes.push("Needs more specific evidence or agreed facts to strengthen the claim.");
  }

  if (toxicityLevel === "high") {
    notes.push(
      "Rejected in this prototype because the argument structure prevents fair dispute resolution without substantial reframing."
    );
  }

  return notes.length ? notes : ["No major reasoning flags detected in this prototype."];
}

function chooseWinner(a, b) {
  if (a.toxicityLevel === "high" && b.toxicityLevel !== "high") {
    return {
      label: "Argument B is stronger",
      reason:
        `Argument A is rejected for ${a.rejectionReason.summary}. Argument B better protects autonomy while still allowing repair.`,
      confidence: "Moderate",
    };
  }

  if (b.toxicityLevel === "high" && a.toxicityLevel !== "high") {
    return {
      label: "Argument A is stronger",
      reason:
        `Argument B is rejected for ${b.rejectionReason.summary}. Argument A better fits the validity and psychology-informed standards.`,
      confidence: "Moderate",
    };
  }

  const aTotal = a.validity + a.psychologyFit + a.clarity;
  const bTotal = b.validity + b.psychologyFit + b.clarity;

  if (Math.abs(aTotal - bTotal) < 12) {
    return {
      label: "No clear winner",
      reason:
        "Both arguments need more detail before a fair recommendation can be made.",
      confidence: "Low",
    };
  }

  return {
    label: aTotal > bTotal ? "Argument A is stronger" : "Argument B is stronger",
    reason:
      aTotal > bTotal
        ? "Argument A currently has stronger validity, clarity, and psychology-fit scores."
        : "Argument B currently has stronger validity, clarity, and psychology-fit scores.",
    confidence: "Moderate",
  };
}

function renderReport(analysis, sourceLabel = "Local prototype analysis") {
  return `
    <article class="report-card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(sourceLabel)}</span>
        <span class="badge">Psychology default</span>
        <span class="badge">${escapeHtml(analysis.lens)}</span>
      </div>
      <h3>Dispute summary</h3>
      <p>${escapeHtml(analysis.summary)}</p>
      ${
        analysis.apiStatus
          ? `<p class="api-status">${escapeHtml(analysis.apiStatus)}</p>`
          : ""
      }
    </article>

    ${renderArgument("Argument A", analysis.argumentA)}
    ${renderArgument("Argument B", analysis.argumentB)}

    <article class="report-card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(analysis.decision.confidence)} confidence</span>
      </div>
      <h3>${escapeHtml(analysis.decision.label)}</h3>
      <p>${escapeHtml(analysis.decision.reason)}</p>
    </article>

    <article class="report-card">
      <h3>Psychology-informed analysis</h3>
      <p>${escapeHtml(analysis.psychology)}</p>
    </article>

    ${
      analysis.optionalLensAnalysis
        ? `<article class="report-card">
            <h3>Optional lens analysis</h3>
            <p>${escapeHtml(analysis.optionalLensAnalysis)}</p>
          </article>`
        : ""
    }

    ${
      analysis.safetyNotice
        ? `<article class="report-card">
            <div class="badge-row"><span class="badge danger">Safety notice</span></div>
            <h3>When debate is not enough</h3>
            <p>${escapeHtml(analysis.safetyNotice)}</p>
          </article>`
        : ""
    }

    <article class="report-card">
      <h3>Unresolved assumptions</h3>
      <p>${escapeHtml(analysis.assumptions)}</p>
    </article>
  `;
}

function renderArgument(title, argument) {
  return `
    <article class="report-card">
      <div class="badge-row">
        <span class="badge ${argument.toxicityLevel === "high" ? "danger" : argument.toxicityLevel === "moderate" ? "warning" : ""}">
          ${escapeHtml(argument.category)}
        </span>
      </div>
      <h3>${title} validity review</h3>
      <div class="score-row">
        <div class="score"><strong>${argument.validity}</strong>Validity</div>
        <div class="score"><strong>${argument.psychologyFit}</strong>Psychology fit</div>
        <div class="score"><strong>${argument.clarity}</strong>Clarity</div>
      </div>
      <ul>
        ${argument.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function readableLens(value) {
  const labels = {
    none: "No optional lens selected",
    "christian-marriage": "Christian marriage lens selected",
    stoic: "Stoic lens selected",
    "custom-values": "Custom values lens selected",
  };
  return labels[value] || labels.none;
}

function recommendationLabel(winner) {
  const labels = {
    A: "Argument A is stronger",
    B: "Argument B is stronger",
    no_clear_winner: "No clear winner",
    no_valid_argument: "No valid argument remains",
  };
  return labels[winner] || "No clear winner";
}

function readableInvalidCategory(category) {
  const labels = {
    none: "No invalid category",
    invalid_but_repairable: "Invalid but potentially repairable",
    missing_information: "Invalid due to missing information",
    emotional_flooding: "Invalid due to emotional flooding",
    coercive_or_manipulative_reasoning:
      "Invalid due to coercive or manipulation-like reasoning",
    severe_abuse_threat_or_control:
      "Invalid due to severe abuse, threat, or control",
    contempt_or_sweeping_claims: "Invalid due to contempt or sweeping claims",
    bad_faith_agreement: "Invalid due to bad-faith agreement",
  };
  return labels[category] || "Invalid due to harmful reasoning pattern";
}

function capitalize(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function countMatches(text, terms) {
  return terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function unique(items) {
  return [...new Set(items)];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
