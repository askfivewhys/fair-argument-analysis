# Fair Argument Analysis

Fair Argument Analysis is an AI showcase prototype for private dispute review.
It is designed for situations where a popularity vote is not enough and the user
needs structured reasoning support.

## What It Demonstrates

- Independent review of each argument
- Early safety and harmful-pattern screening
- Separation between argument patterns and personal character
- Psychology-informed default judgment
- Optional lenses that must be selected before analysis
- Structured output suitable for a future LLM JSON response

## Run Locally

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

The current version is a static prototype with local sample analysis. The next
version should add a server-side OpenAI API call using the schema in
`model_prompt.md`.

## AI Integration

This project includes a serverless endpoint at `api/analyze.js`. When deployed
to Vercel with `OPENAI_API_KEY` configured, the app calls OpenAI's Responses API
and requests strict JSON output for the analysis report.

When the app is opened from `file://` or when the API key is not configured, it
falls back to the local prototype analyzer so the demo still works.

Required environment variable:

```text
OPENAI_API_KEY=your_key_here
```

Optional environment variable:

```text
OPENAI_MODEL=gpt-4.1-mini
```

## Deploy For Showcase

Recommended path:

1. Create a GitHub repository.
2. Push this project to that repository.
3. Import the repository into Vercel.
4. Add `OPENAI_API_KEY` in Vercel Project Settings.
5. Deploy.
6. Submit the Vercel URL to Handshake.

This keeps the API key private because the browser only calls `/api/analyze`;
the key is used server-side.

## Review Test Cases

The app includes a Test Cases panel. Use it to load and run scenarios, then
compare expected behavior against the current observed output. The same cases
are also available in:

- `test_cases.md`
- `test_cases.json`

## Showcase Summary

Problem:
People can get stuck in arguments where emotion, poor reasoning, or coercive
patterns make resolution difficult.

Solution:
An AI-assisted workflow that first checks whether each argument is valid and
safe to consider, then uses psychology-informed criteria to compare remaining
valid arguments.

What I learned:
AI is most useful in sensitive human contexts when it is constrained by explicit
rules, transparent categories, privacy defaults, and structured outputs.
