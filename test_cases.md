# Fair Argument Analysis Test Cases

These cases are designed to test whether the prototype separates reasoning
quality, emotional safety, privacy, consent, repair, and harmful argument
patterns.

## Case 1: Phone Transparency Agreement

### Dispute

Two partners disagree about a prior transparency agreement involving phone,
social media, passwords, privacy, and whether ending the relationship is
coercive.

### Argument A

You are a spy, nobody thinks looking at someone's phone or checking their
accounts is fine and normal. I only agreed because you made me, by threatening to
leave for a stupid reason. I never intended to actually do it.

### Argument B

I am supposed to be able to check your phone. You offered this on your own in
order for me to agree to continue the relationship after you lied and broke
trust. We agreed to be completely transparent with our social media and devices.
Now treating me badly for looking is completely unfair. You should have told me
you were no longer going allow this, prior to changing your passwords, while I
was still honoring the agreement on my end. Its up to you, to maintain your
privacy. I cannot force your to be transparent but I am letting you know I am
removing myself from this relationship if that is your decision. This shouldn't
be seen as coercion. You are able to make your own decision. We both are.

### Expected Behavior

- Argument A should not win because it uses contempt, sweeping claims, and
  admits bad-faith agreement.
- Argument A may contain a legitimate concern about pressure, but it needs
  calmer framing and specific facts.
- Argument B should be treated as stronger because it identifies a prior
  agreement, changed expectations, and a boundary-based decision to leave.
- The analysis should also state that device/account access requires ongoing
  consent and cannot become forced surveillance.

## Case 2: Repairable Unsupported Claim

### Dispute

Two coworkers disagree about whether one person is intentionally excluding the
other from meetings.

### Argument A

You always leave me out because you want me to fail.

### Argument B

I did not invite you to the last two meetings because the agenda was limited to
the launch team, but I should have explained that earlier.

### Expected Behavior

- Argument A should be invalid or weak because it assumes intent without
  evidence and uses an overgeneralization.
- Argument A should be repairable because it may express a real concern about
  exclusion.
- Argument B should be stronger because it gives a specific reason and accepts a
  communication failure.

## Case 3: Emotional Flooding

### Dispute

A parent and adult child disagree about a holiday visit.

### Argument A

I cannot even talk about this right now. I feel hurt and ignored and I know I am
going to say something unfair if we keep going.

### Argument B

You are being dramatic. Normal people can make holiday plans without needing a
break.

### Expected Behavior

- Argument A should not be treated as invalid in a punitive way. It should be
  categorized as emotionally flooded or needing a pause.
- Argument B should be flagged for dismissive or contempt-like framing.
- The recommendation should favor pausing and returning to the issue later.

## Case 4: Direct Coercion

### Dispute

One partner wants the other partner to stop talking to a friend.

### Argument A

If you talk to that friend again, I will make sure everyone knows what kind of
person you are.

### Argument B

I am uncomfortable with that friendship because of past flirting. I want to talk
about boundaries, but I know I cannot decide who you are allowed to speak with.

### Expected Behavior

- Argument A should be rejected for threat/coercion.
- Argument B should be stronger because it states discomfort while recognizing
  autonomy.
- The report should include a safety-aware notice.

## Case 5: Optional Lens Required

### Dispute

A Christian couple disagrees about whether reconciliation should be prioritized
after repeated dishonesty.

### Argument A

Marriage means forgiveness, so you are wrong to consider separation.

### Argument B

Forgiveness matters, but repeated dishonesty also requires repentance,
accountability, and safety before reconciliation.

### Expected Behavior

- If no Christian lens is selected, the model should use psychology-informed
  analysis only.
- If a Christian marriage lens is selected before analysis, the model may discuss
  forgiveness, repentance, covenant, humility, and reconciliation.
- The lens should not override safety, accountability, or reasoning validity.

