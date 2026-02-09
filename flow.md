High-Level Workflow (One Sentence)

User pastes repo URL → system analyzes risk signals → computes scores → returns a verdict page → caches result

That’s it.
No accounts. No dashboards. No ongoing responsibility.

2️⃣ User-Facing Workflow (What the User Experiences)
Step 1: Landing Page

User lands on /

Sees one clear input:

“Paste a GitHub repository URL”

Step 2: Submit Repo

User pastes:
https://github.com/owner/repo

Clicks Analyze Repo

Step 3: Processing State

Loading screen:

“Analyzing contributors…”

“Checking dependencies…”

“Evaluating maintenance patterns…”

(fake progress is fine, real work happens async)

Step 4: Verdict Page

Redirect to:

/report/owner/repo


User sees:

Health Score (0–100)

Risk level (Low / Moderate / High)

Primary risks

Strengths

Takeover readiness text

Step 5: Exit

User leaves

No account

No retention pressure

Mission accomplished

3️⃣ Backend Workflow (THIS IS THE IMPORTANT PART)
A. Request Intake
POST /analyze


Input

{
  "repoUrl": "https://github.com/owner/repo"
}

Validation

Valid GitHub URL

Public repo only

Rate-limit per IP

B. Cache Check (Critical)

Before doing anything expensive:

SELECT * FROM reports
WHERE owner = ?
AND repo = ?
AND updated_at > now() - 7 days

If found:

Return cached report

Redirect user instantly

If not found:

Queue analysis job

C. Analysis Job Workflow (Async Worker)
Step 1: Repo Metadata

GitHub API:

repo details

default branch

primary language

Step 2: Contributor Analysis (Bus Factor)

GitHub API:

commits (last 6–12 months)

contributor distribution

Output

% commits by top contributor

contributor concentration index

Step 3: Maintenance Analysis

GitHub API:

commit timestamps

issue open → response time

PR open → merge time

Key insight
You care about consistency, not volume.

Step 4: Dependency Scan

From repo files:

package.json

requirements.txt

go.mod

etc.

Signals:

dependency count

outdated major versions

abandoned packages (basic heuristics)

Step 5: Operational Readiness Scan

Check for:

README.md

install steps keywords

CI config (.github/workflows)

test folders

Step 6: Ownership Clarity

Check for:

CODEOWNERS

repeated PR reviewers

single-approver patterns

D. Scoring Engine (Pure Logic)

Each pillar:

Returns 0–20

Example:

busFactorScore = 20 - riskPenalty


Final score:

totalScore = sum(all five scores)


Risk level:

>= 80 → Low Risk

50–79 → Moderate Risk

< 50 → High Risk

E. Verdict Generator (Human Language Layer)

This is not data, this is judgment.

Example logic:

If bus factor < 8 → “Single-maintainer dependency”

If README missing → “High onboarding friction”

If dependencies abandoned → “Hidden technical debt risk”

Output:

max 3 risks

max 2 strengths

takeover readiness text

F. Persistence

Save result:

reports
- owner
- repo
- score
- breakdown
- risks
- strengths
- updated_at


TTL:

7 days (configurable)

4️⃣ Page Rendering Workflow
Report Page Load
GET /report/owner/repo


Backend:

Fetch report from DB

If missing → trigger analysis → show loading state

Frontend:

Server-rendered

No client-side logic needed

5️⃣ Failure & Edge Case Workflow
GitHub API Failure

Show:

“GitHub rate limit reached. Try again later.”

Do NOT retry aggressively

Huge Repos

Cap analysis window (e.g. last 12 months)

Mention this in FAQ (credibility)

Repo with No Activity

Score tanks intentionally

This is a feature, not a bug

6️⃣ Cron Workflow (Silent Maintenance)

Daily cron:

Clean expired reports

Refresh popular repos (optional)

Monitor API quota

Weekly cron:

Dependency rules update (light)