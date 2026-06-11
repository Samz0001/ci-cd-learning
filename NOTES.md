# CI/CD Notes — Learning with GitHub Actions + Playwright

## 1. What is CI/CD?

- **CI (Continuous Integration)**: Every time you push code, an automated
  process checks it out, installs dependencies, and runs your tests.
  Goal: catch bugs early, before they reach `main`.
- **CD (Continuous Delivery/Deployment)**: If CI passes, the pipeline
  automatically deploys (or prepares to deploy) the app — to a server,
  GitHub Pages, app store, etc.

In this project:
- **CI job** = `test` → installs deps, installs browsers, runs Playwright tests.
- **CD job** = `deploy` → publishes the static site to GitHub Pages,
  but only runs if `test` passed AND the branch is `main`.

## 2. Core GitHub Actions vocabulary

| Term | Meaning |
|---|---|
| **Workflow** | The whole automation file (`.github/workflows/playwright.yml`). |
| **Trigger (`on:`)** | What event starts the workflow — push, pull request, schedule, manual button, etc. |
| **Job** | A group of steps that run on a single machine (runner). Jobs run in parallel by default. |
| **Runner** | The virtual machine that executes a job (e.g. `ubuntu-latest`). |
| **Step** | One command or pre-built action inside a job. |
| **Action** | A reusable step someone already built (e.g. `actions/checkout@v4`). |
| **Artifact** | A file/folder saved from a run so you can download it later (e.g. the Playwright HTML report). |
| **`needs:`** | Makes one job wait for another job to finish first. |
| **Secrets** | Encrypted variables (API keys, tokens) you add in repo settings, used in workflows without exposing them. |

## 3. How our pipeline is structured

```
on: push to main / pull_request to main
│
├── job: test  (CI)
│     1. checkout code
│     2. set up Node.js
│     3. npm ci                      → install dependencies
│     4. npx playwright install      → install browsers
│     5. npx playwright test         → run all tests
│     6. upload-artifact              → save HTML report even if tests fail
│
└── job: deploy (CD)   [needs: test, only on main]
      1. checkout code
      2. configure-pages
      3. upload-pages-artifact         → package the site
      4. deploy-pages                  → publish to GitHub Pages
```

## 4. Why each Playwright command matters

- `npm ci` — clean install based on `package-lock.json` (faster & more
  reproducible than `npm install` — important for CI).
- `npx playwright install --with-deps` — downloads the browser binaries
  (Chromium/Firefox/WebKit) the runner needs, plus OS-level dependencies.
- `npx playwright test` — runs everything in `tests/`, using
  `playwright.config.js` (which also starts the local web server via the
  `webServer` block).

## 5. Reading pipeline results

- Green check ✅ on a commit/PR = all jobs passed.
- Red ✗ = a job failed — click into it to see which **step** failed and
  read the logs.
- Download the `playwright-report` artifact from a failed run to get
  screenshots and a full HTML report of what went wrong.

## 6. Where this connects to your work

The exact same pattern (checkout → install → run Playwright tests →
upload report) is what you'd use for ZeoCRM/ZeoVerify/ZeoForex test
suites: your Page Object Model tests, fallback selector strategies, etc.
The only differences in a real project would be:
- Adding environment variables/secrets for staging URLs, DB creds, etc.
- Possibly running tests against multiple browsers/projects in parallel
  (`matrix` strategy).
- The "deploy" job would be replaced or removed — QA pipelines often stop
  at the "test" job and just report results (e.g. to Slack).

## 7. Useful follow-up topics (once this works)

- **Matrix builds** — run the same job across multiple browsers/Node versions.
- **Caching** — cache `node_modules` / Playwright browsers to speed up runs.
- **Secrets & environments** — store API keys, staging credentials.
- **Manual triggers** (`workflow_dispatch`) — run a pipeline on demand.
- **Scheduled runs** (`cron`) — e.g. nightly regression suite.
- **Slack/Email notifications** on failure.
