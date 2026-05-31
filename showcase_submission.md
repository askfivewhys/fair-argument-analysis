# Showcase Submission Draft

## Project Title

Fair Argument Analysis

## Short Description

Fair Argument Analysis is a private AI-assisted prototype that helps users review
serious disagreements. It evaluates each argument separately, rejects invalid or
harmful reasoning patterns, and uses psychology-informed criteria as the default
tie-breaker when valid arguments remain.

## What I Built

I built a browser-based prototype with an argument intake form, sample dispute,
structured analysis report, and supporting model specification. The app shows how
an AI system could separate popularity, logic, emotional safety, and
psychology-informed reasoning. I also added a test-case review panel so users
can compare expected behavior against the observed model output.

## How I Used AI

AI was used to design the evaluation framework, define the safety and validity
categories, draft the model prompt, and build the working prototype. The planned
production version uses a server-side OpenAI Responses API endpoint with a
strict JSON schema to return validity checks, harmful-pattern flags,
reconstruction guidance, psychology-informed analysis, recommendations,
confidence, and unresolved assumptions. The local prototype fallback remains
available for offline review.

## What I Learned

I learned that a useful AI dispute tool should not simply choose a winner. It
needs a careful decision architecture: safety screen first, validity gate second,
psychology-informed comparison third, and optional worldview lenses only when
selected before analysis begins.

## Future Direction

The serious analysis tool could remain free and private, while a separate casual
crowd-vote product could support the ecosystem through lightweight A/B decisions,
age-group sentiment, and participation-based access.

## Demo Notes

The hosted version should be deployed with an `OPENAI_API_KEY` environment
variable. If the key is not configured, the app still demonstrates the workflow
using the local prototype analyzer.
