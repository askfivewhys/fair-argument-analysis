# Fair Argument Analysis Spec

## Purpose

Fair Argument Analysis is a private AI-assisted dispute analysis workflow. It
evaluates each argument separately, disqualifies invalid or harmful reasoning,
and applies psychology-informed judgment to remaining valid arguments unless an
optional lens was selected before analysis.

## Core Rules

- Judge argument patterns, not the person's character.
- Evaluate safety and toxicity before ordinary reasoning quality.
- Disqualify invalid reasoning before comparing arguments.
- Use psychology-informed criteria as the default secondary standard.
- Apply religious, philosophical, cultural, or values-based lenses only when
  selected before analysis begins.
- Report uncertainty and unresolved assumptions instead of pretending missing
  context is known.

## Required Inputs

- Dispute summary
- Argument A
- Argument B
- Agreed facts
- Disputed facts, if available
- Evidence offered, if available
- Optional preselected lens
- Desired outcome, if available

## Safety And Toxicity Screen

Reject an argument, even if it appears logically organized, when the argument
relies on:

- threats
- coercion
- intimidation
- dehumanization
- degradation
- manipulation-like pressure
- gaslighting patterns
- guilt-tripping
- blackmail or extreme ultimatums
- isolation tactics
- control over another person's body, money, relationships, faith, or autonomy

The model should identify the harmful pattern without claiming certainty about
the speaker's inner intent.

## Invalid Argument Categories

1. Invalid but repairable
2. Invalid due to confusion or missing information
3. Invalid due to emotional flooding
4. Invalid due to coercive or manipulation-like reasoning
5. Invalid due to severe abuse, threat, or control

Repairable invalid arguments may receive reconstruction questions. Arguments in
the coercive or severe categories should be rejected in the current dispute and
should not be immediately restructured into a more persuasive version.

## Psychology-Based Tie-Breaker

When more than one valid argument remains, compare them using:

- emotional safety
- autonomy and consent
- healthy boundaries
- accountability
- repair after harm
- proportionality
- harm reduction
- power imbalance awareness
- long-term relational health
- willingness to consider the other person's experience

## Optional Lenses

Optional lenses may include religious tradition, personal philosophy, cultural
norms, family values, or user-defined priorities. They must be selected before
analysis begins. Psychology remains visible even when another lens is selected.

## Output Format

- Summary of disagreement
- Argument A validity review
- Argument B validity review
- Disqualified arguments and reasons
- Invalid argument category, if applicable
- Reconstruction questions, if appropriate
- Psychology-informed analysis
- Optional lens analysis, if selected
- Final recommendation
- Confidence level
- Unresolved assumptions
- Safety notice, if needed
