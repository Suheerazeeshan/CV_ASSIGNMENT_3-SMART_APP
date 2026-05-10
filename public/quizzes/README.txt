Faculty quiz bank (JSON)
========================

This folder holds quizzes that ship with the app and merge into local storage on load.
Students see them under:
  - Sample quiz (practice, not graded)
  - Take quiz (graded attempts → faculty reports)

Faculty solutions:
  Faculty → Quizzes → open any "Faculty bank" quiz → full answer key (same data as JSON).

How to add or edit
------------------
1. Copy a file such as quiz-cysts-review.json and rename it.
2. Edit id, title, questions, options, and correctOptionId (must match one option id per question).
3. Add the filename to index.json under "files".
4. Reload the app (or redeploy). Quizzes merge automatically; same id overwrites earlier copy.

PDF-upload quizzes from the app are stored only in the browser and are not saved here unless you export manually.
