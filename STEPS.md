# Step-by-Step: Build Your First CI/CD Pipeline

Follow these steps in order. Run the commands on your own machine
(or the Zeonix server) and tell me what you see at each step — I'll
help you debug if anything goes wrong.

---

## Step 0 — Prerequisites

Make sure you have:
- [ ] A GitHub account
- [ ] Git installed (`git --version`)
- [ ] Node.js installed (`node -v`, should be v18+)

---

## Step 1 — Get the project files locally

I've created the project for you. Download/copy this folder to your
machine, keeping the structure:

```
ci-cd-learning/
├── .github/workflows/playwright.yml
├── .gitignore
├── about.html
├── index.html
├── NOTES.md
├── package.json
├── playwright.config.js
├── style.css
└── tests/
    └── site.spec.js
```

---

## Step 2 — Install dependencies & run tests locally first

Before touching CI, make sure it works on your machine:

```bash
cd ci-cd-learning
npm install
npx playwright install
npm test
```

✅ You should see 3 tests pass (homepage title, button click, navigation).
If a browser is opened or an HTML report is generated, that's normal.

➡️ **Tell me the output here before moving on.**

---

## Step 3 — Create a GitHub repository

1. Go to GitHub → **New repository**.
2. Name it something like `ci-cd-learning`.
3. Keep it **empty** (no README, no .gitignore from GitHub — we already have one).
4. Copy the repo URL (e.g. `https://github.com/<your-username>/ci-cd-learning.git`).

---

## Step 4 — Push your project to GitHub

```bash
git init
git add .
git commit -m "Initial commit: site + Playwright tests + CI/CD workflow"
git branch -M main
git remote add origin https://github.com/<your-username>/ci-cd-learning.git
git push -u origin main
```

➡️ **Tell me once this is pushed.**

---

## Step 5 — Watch the pipeline run

1. On GitHub, go to your repo → **Actions** tab.
2. You should see a workflow run called **"Playwright CI/CD"** start
   automatically (triggered by your push).
3. Click into it. You'll see two jobs: `test` and `deploy`.
4. Click `test` to watch each step run live.

➡️ **Tell me what status you see (green ✅ or red ❌) and I'll help
interpret it.**

---

## Step 6 — Enable GitHub Pages (one-time setup for the deploy job)

The `deploy` job needs GitHub Pages to be set to "GitHub Actions" mode:

1. Repo → **Settings** → **Pages**.
2. Under "Build and deployment" → **Source**, select **GitHub Actions**.
3. Re-run the workflow (Actions tab → select the run → "Re-run all jobs").

➡️ Once it succeeds, the `deploy` job will give you a live URL where
your site is hosted — open it and check it works!

---

## Step 7 — Make a change and watch CI/CD react

This is the real "aha" moment. Try one of these:

**A) A passing change:**
- Edit `index.html`, change the message text in the `<p id="message">`
  or the heading.
- Update the matching expectation in `tests/site.spec.js` if needed.
- Commit & push:
  ```bash
  git add .
  git commit -m "Update homepage text"
  git push
  ```
- Watch Actions — pipeline runs again, deploys the updated site.

**B) A failing change (to see CI catch a bug):**
- Edit `tests/site.spec.js` and change an expected value to something
  wrong on purpose, e.g.:
  ```js
  await expect(message).toHaveText('Wrong text');
  ```
- Push it.
- Watch the `test` job **fail** ❌, and notice the `deploy` job is
  **skipped** because it `needs: test`.
- Download the `playwright-report` artifact from the failed run to see
  the failure details/screenshot.
- Fix the test and push again — watch it go green.

➡️ **Tell me what happens at each sub-step (A and B) — especially any
error messages.**

---

## Step 8 — (Optional) Add a manual trigger

Once steps 1–7 work, I can show you how to add `workflow_dispatch` so
you can trigger the pipeline manually with a button — useful for QA
regression runs on demand.

---

## Where we go from here

Once this basic pipeline clicks for you, we can build a second one using
one of your actual Playwright test suites (e.g. for ZeoCRM), including:
- Environment variables/secrets for staging URLs & DB credentials
- Running tests against multiple browsers (matrix)
- Caching dependencies for faster runs
- Sending pass/fail notifications
