# Pot Luck: guided codebase investigation

Reconstructed practice based on local workshop notes. This is not an authenticated Bloomberg interview repository or a promise of the task you will receive.

You have an existing Python implementation and starter tests. Read spec.md before editing. Use an AI assistant deliberately; keep responsibility for product assumptions and verification.

Discuss:
1. Which rules need clarification before implementation?
2. Do Entry, Draw, Payout, and PayoutPlan represent the lifecycle correctly?
3. How should payouts work, and which examples independently establish the expected result?
4. Find a mismatch, reproduce it, make a bounded correction, and explain the evidence.

Suggested local command: python -m pytest -q tests
Install pytest in your own project environment if necessary.

The starter deliberately contains defects and its tests are incomplete. Do not interpret passing starter tests as proof of correctness. Reference material in the app is separately revealed.

Exercise decisions to confirm: positional matching; ASCII digits; reject entries after closure; immutable closed snapshot; whole-cent shares rounded down with remainders retained; per-entry awards. The starter already rejects a repeated close: preserve that contract. Future-draw rollover behavior is unspecified and outside this exercise.
