import type { Lesson } from './curriculum';
export const potluckLesson:Lesson={
  "id": "potluck-case",
  "title": "Pot Luck: investigate the supplied codebase",
  "subtitle": "A complete workshop-style case: spec, starter repository, tests, and a guided bug investigation.",
  "group": "Pot Luck workshop",
  "minutes": 45,
  "icon": "00",
  "source": "Reconstructed from local workshop notes • not authenticated Bloomberg interview material",
  "concepts": [
    "Repository",
    "Call path",
    "Invariant",
    "Regression test"
  ],
  "lab": "potluck",
  "steps": [
    {
      "title": "Read the candidate brief",
      "goal": "Open README.md and spec.md in the Repository tab before reading the implementation.",
      "paragraphs": [
        "You join a small existing Python project for a community fundraiser. Participants buy entries with five-digit codes. The supplied implementation generates a draw and calculates payouts, but it may not meet the product rules. Your work is to understand the requirements, review the model, and investigate a mismatch with AI assistance.",
        "This exercise follows the shape described in your local workshop notes. The files are a local reconstruction with deliberately seeded defects, not verified Bloomberg interview materials. Work through it as a guided codebase investigation; there is no timer or completion score.",
        "The discussion has four parts: clarify the spec, assess the Entry/Draw/Payout model, explain payout calculation and tests, and diagnose a defect. Open the Repository tab for the complete brief, implementation, and starter tests. Keep the smaller Pot Luck lessons as optional deep dives."
      ],
      "code": "potluck/\n  README.md\n  spec.md\n  question.py\n  tests/test_question.py\n\npython -m pytest -q tests",
      "lines": [],
      "question": "What should define your first change?",
      "options": [
        "A demonstrated mismatch between agreed behavior and supplied code.",
        "A full rewrite before reading the tests."
      ],
      "correct": 0,
      "feedback": "Start with a rule and an observable failure. The starter already implements some behavior correctly.",
      "hint": "Read the specification and find an uncertain rule.",
      "takeaway": "Your deliverable is a reasoned change with evidence.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Open README.md and spec.md in the Repository tab before reading the implementation. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    },
    {
      "title": "Clarify rules and preserve existing contracts",
      "goal": "Separate product ambiguity from an implementation defect.",
      "paragraphs": [
        "The spec gives a $10,000 seed, $5 per entry, five-digit codes, and tiers of 100%, 40%, 20%, and 5%. A five-match tier excludes all lower tiers; otherwise each populated tier takes its percentage of the original pot. Awards are per entry, so one participant can receive several.",
        "Ask whether matching is positional, whether only ASCII digits are valid, where fractional cents go, and whether the closed draw must be immutable. For this reconstruction we agree on positional matches, ASCII tokens, floor-to-cent shares with leftovers retained, and a frozen draw. The supplied starter test explicitly requires a second close to raise DrawClosedError; preserve that interface.",
        "Future-draw rollover and secure production randomness need separate requirements. Do not silently add repeated-draw behavior, change the API, or introduce an unrelated persistence layer."
      ],
      "code": "Rule → clarification → agreed expectation\n\"match\" → same position? → yes, for this exercise\n\"even split\" → fractional cents? → round down; retain remainder\nclose_draw twice → existing test → raises DrawClosedError",
      "lines": [],
      "question": "Should a repeated close now return the earlier draw?",
      "options": [
        "No: the supplied test requires DrawClosedError.",
        "Yes: silently replace the existing contract."
      ],
      "correct": 0,
      "feedback": "Preserve the repository’s explicit repeat-close contract. Idempotency is not automatically the right rule for every operation.",
      "hint": "Check test_draw_cannot_be_closed_twice.",
      "takeaway": "Read existing tests as contract evidence, not as complete coverage.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Separate product ambiguity from an implementation defect. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    },
    {
      "title": "Map the request and data lifecycle",
      "goal": "Trace enter → close_draw → calculate_payouts without reading every line in order.",
      "paragraphs": [
        "FundraiserPool.enter creates Entry records. _generate_code is shared by entry creation and draw closure. close_draw freezes the pot amount, but currently stores entries=self.entries, sharing the live list. calculate_payouts groups entries by count_matches and creates Payout rows and a PayoutPlan.",
        "Review both membership and values: a tuple copies collection membership, but mutable Entry instances can still change. Consider frozen Entry and Draw records together. A guard in enter prevents late purchases; it does not independently prove the historical snapshot cannot mutate.",
        "Each payout should retain entry_id; grouping solely by participant would merge separate tickets. Money remains integer cents and codes remain text tokens. Find the narrowest function that owns your chosen mismatch."
      ],
      "code": "enter() ── _generate_code() ── Entry\nclose_draw() ── _generate_code() ── Draw\ncalculate_payouts(Draw) ── count_matches() ── PayoutPlan",
      "lines": [],
      "question": "Why does a closed-state guard not fully fix snapshots?",
      "options": [
        "Existing references can still mutate shared objects.",
        "The guard automatically copies every object."
      ],
      "correct": 0,
      "feedback": "Rejecting a late enter and copying immutable draw data address different failure paths.",
      "hint": "Look at entries=self.entries.",
      "takeaway": "Trace lifecycle and ownership, not just individual function bodies.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Trace enter → close_draw → calculate_payouts without reading every line in order. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    },
    {
      "title": "Establish the baseline and choose one defect",
      "goal": "Inspect starter tests, predict failure, then reproduce one cause.",
      "paragraphs": [
        "The visible suite has five tests; this exact starter passes four and fails the generated-zero test. Other defects survive because the suite does not test them. The repository explorer includes the full tests; the app displays a recorded baseline rather than pretending to run Python in the browser.",
        "At random_source=lambda: 0, _generate_code returns \"0\", not \"00000\": a clean formatting failure. At 0.999999 the result is \"99998\", exposing the wrong multiplier separately. The tempting 0.00042 case returns \"41\" on this starter; it mixes the multiplier and formatting defects and is a poor first isolating test.",
        "Choose one issue first. State the expected result before asking AI to patch. For a formatting-only change use zero, then investigate the endpoint defect independently. After both corrections, test both the entry and winning-code generation paths."
      ],
      "code": "pool = FundraiserPool(random_source=lambda: 0)\nassert pool.enter(\"Mina\").code == \"00000\"\n# Starter actual: \"0\"\n\npool = FundraiserPool(random_source=lambda: 0.999999)\nassert pool.enter(\"Mina\").code == \"99999\"\n# Starter actual: \"99998\"",
      "lines": [],
      "question": "Which input isolates missing zero padding here?",
      "options": [
        "0, because both multipliers still produce integer zero.",
        "0.00042, because it cannot expose another defect."
      ],
      "correct": 0,
      "feedback": "Zero removes the multiplier difference. The small nonzero value exposes both defects simultaneously.",
      "hint": "Calculate int(r * 99999) before comparing formats.",
      "takeaway": "A regression test should fail for the cause you intend to fix.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Inspect starter tests, predict failure, then reproduce one cause. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    },
    {
      "title": "Check the payout boundary, not just conservation",
      "goal": "Use a nondivisible tier budget to expose rounding overpayment.",
      "paragraphs": [
        "The original four-entry example has a pot of 1,002,000 cents. Three four-match winners get 133,600 cents each and one two-match winner gets 50,100; rollover is 551,100. The starter can pass that exact arithmetic example.",
        "Add a fifth, nonwinning entry. The pot becomes 1,002,500 cents and the four-match budget is 401,000. Three winners should get 133,666 each; the two-match winner gets 50,125. Total paid is 451,123 and rollover 551,377. round() instead gives 133,667 per four-match entry and pays that tier 401,001 cents—one over budget.",
        "Total paid + rollover == pot is necessary but insufficient: this starter defines rollover as pot - paid, so conservation can pass even with an overpaid tier. Also assert each populated tier’s actual awards do not exceed its budget, and assert independently calculated per-entry amounts."
      ],
      "code": "pot = 1_002_500\nbudget = pot * 40 // 100  # 401000\nexpected_each = budget // 3  # 133666\nwrong_each = round(pot * 40 / 100 / 3)  # 133667\nassert expected_each * 3 <= budget\nassert wrong_each * 3 > budget",
      "lines": [],
      "question": "Can conservation alone catch this tier overpayment?",
      "options": [
        "No: rollover is calculated by subtraction.",
        "Yes: conservation proves every payout rule."
      ],
      "correct": 0,
      "feedback": "The total can balance while the allocation is wrong. Verify both conservation and per-tier limits.",
      "hint": "Look at how rollover_cents is constructed.",
      "takeaway": "Test allocation rules as well as aggregate totals.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Use a nondivisible tier budget to expose rounding overpayment. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    },
    {
      "title": "Review the patch and explain the evidence",
      "goal": "Reveal the reference only after identifying a defect and a test.",
      "paragraphs": [
        "Use the Repository tab’s reference toggle to compare the full corrected implementation with the starter. The reconstruction contains seven defect themes: range, formatting, positional matching, snapshot aliasing, late entries, rounding, and ASCII validation. These are seeded practice issues, not a claim about a real interview’s bug count.",
        "Review one change at a time. Preserve public function names, per-entry identity, perfect-tier exclusivity, and repeat-close rejection. Ask AI to map every changed hunk to a requirement and a regression test. The reference is a review aid rather than an invitation to copy unexplained changes.",
        "Wrap up with the requirement, the failing observation, the narrow correction, and what tests establish. For money, include the expected award and budget check. For snapshots, test source-list mutation separately from late-entry rejection. State which assumptions and production concerns remain unverified."
      ],
      "code": "Requirement → failing case → minimal patch → evidence\nPreserved: interfaces, per-entry awards, perfect-tier exclusion\nRechecked: focused regression + existing suite\nOpen questions: future draws, production randomness, identity",
      "lines": [],
      "question": "What makes a useful final explanation?",
      "options": [
        "A requirement, reproduced cause, justified patch, and bounded evidence.",
        "The number of files rewritten or bugs claimed."
      ],
      "correct": 0,
      "feedback": "Visible reasoning and verification make the change reviewable.",
      "hint": "Explain what you actually checked.",
      "takeaway": "Own the engineering decision and the evidence behind it.",
      "prompt": "We are investigating the supplied Pot Luck repository. Current task: Reveal the reference only after identifying a defect and a test. Cite actual functions and distinguish spec rules from exercise assumptions. Do not rewrite the project. Ask me to explain the evidence before suggesting the next edit."
    }
  ]
};
