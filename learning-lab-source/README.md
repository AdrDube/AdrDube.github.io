# Bloomberg Learning Lab — GitHub Pages edition

Published at https://adrdube.github.io/learning-lab/.

18 walkthroughs and 62 guided steps cover codebase investigation, the reconstructed Pot Luck exercise, calendar concurrency, seven common patterns, and data structures. Notes and progress are browser-local.

Live AI guidance opens https://bloomberg-learning-lab.adriel-dube.chatgpt.site/ in a separate tab and requires ChatGPT sign-in. Copy the active lesson context and question using the tutor panel. No API route or credentials are shipped to GitHub Pages. Data does not automatically sync between sites.

## Build

Use Node 22.13+: npm ci, npm test, python3 tests/test_reference.py, then npm run build.

The build writes static assets to ../learning-lab/. Commit both source and generated output. The existing Pages configuration publishes main from the repository root. The portfolio homepage is untouched.

The Pot Luck starter intentionally contains defects. Its initial suite has one expected failure. It is reconstructed practice, not an authenticated Bloomberg interview repository.
