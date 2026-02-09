# GitHub Repo Health Checker (Free Edition)

## 1. Product Overview

### Product Name (working)

**RepoPulse** (rename later if needed)

### Product Vision

Provide a **clear, judgment-based health verdict** for any public GitHub repository so founders, developers, and buyers can quickly answer:

> *“Is this repository safe to rely on, maintain, or acquire?”*

This is **not** an analytics dashboard. It is a **risk & readiness evaluator**.

### Product Stage

* Free-only (no payments)
* Public GitHub repositories only
* No login required (initially)

---

## 2. Target Users

### Primary Users

* Solo founders
* Indie hackers
* Bootstrapped startup teams
* Agencies evaluating client repos
* Buyers on micro-acquisition platforms

### User Jobs-to-be-Done

* Quickly assess repo risk
* Avoid bad technical decisions
* Validate maintainability
* Reduce due-diligence time

---

## 3. Core Value Proposition

**One URL → One verdict → One decision**

Users get:

* A single health score
* Clear risk warnings
* Actionable insights

No charts. No noise. No vanity metrics.

---

## 4. Feature Set (Free MVP)

### 4.1 Repo Input

* Paste public GitHub repo URL
* Validate repo exists and is public
* Rate-limit per IP

---

### 4.2 Health Score Engine (Core)

Final output: **Score out of 100**

#### 1. Bus Factor Score (0–20)

**Goal:** Detect single-person dependency risk

Signals:

* % of commits by top contributor
* % of PR merges by same person

Risk Flags:

* > 70% commits by 1 person
* No recent secondary contributors

---

#### 2. Maintenance Reality Score (0–20)

**Goal:** Is this repo truly alive?

Signals:

* Commit consistency (not frequency)
* Issue response latency
* PR merge delays
* Time since last meaningful commit

---

#### 3. Dependency Fragility Score (0–20)

**Goal:** Detect hidden technical debt

Signals:

* Number of dependencies
* Unmaintained dependencies
* Deprecated packages
* Known vulnerable versions (light check)

---

#### 4. Operational Readiness Score (0–20)

**Goal:** Can someone else run this project?

Signals:

* README presence
* Setup instructions clarity
* CI config existence
* Test folder existence

---

#### 5. Ownership Clarity Score (0–20)

**Goal:** Is responsibility clear?

Signals:

* CODEOWNERS file
* Maintainer activity
* Review authority patterns
* Documentation authorship spread

---

## 5. Output & Verdict

### Health Summary

* Overall Score (0–100)
* Risk Level:

  * Low Risk (80–100)
  * Moderate Risk (50–79)
  * High Risk (<50)

### Key Sections

* ⚠️ Primary Risks (max 3)
* ✅ Strengths (max 2)
* 📌 Takeover Readiness (text-based)

Example:

> **Repo Health: 72 / 100 (Moderate Risk)**
>
> Primary Risk: Single-maintainer dependency
> Secondary Risk: Weak deployment documentation
>
> Estimated stabilization time: 2–3 weeks

---

## 6. Pages & Routes

### 6.1 Landing Page (`/`)

Sections:

* Hero: "Know if a GitHub repo is safe in 60 seconds"
* Repo URL input
* Example report preview (static)
* How it works (3 steps)
* Who it’s for
* Footer

---

### 6.2 Report Page (`/report/:owner/:repo`)

Sections:

* Repo header (name, stars, language)
* Overall Health Score
* Risk Breakdown (5 scores)
* Primary Warnings
* Strengths
* Technical Notes

---

### 6.3 About Page (`/about`)

* What this tool is
* What it is NOT
* Scoring philosophy

---

### 6.4 FAQ Page (`/faq`)

Sample questions:

* Is this free?
* Is my repo data stored?
* Why is my score low?
* Is this an audit?

---

## 7. Non-Goals (Important)

The product will NOT:

* Track private repos
* Provide real-time monitoring
* Replace security audits
* Show vanity metrics (stars, forks focus)
* Require user accounts

---

## 8. Technical Architecture (High Level)

### Backend

* Node.js / Bun
* GitHub REST API
* Cron-based cache refresh
* PostgreSQL (cached reports)

### Frontend

* Next.js (minimal)
* Server-side rendering
* Tailwind CSS

### Infra

* Single VPS
* Background job queue
* API rate-limiting

---

## 9. Success Metrics (Free Phase)

* Time-to-verdict < 10 seconds
* < 1% GitHub API errors
* Reports generated per day
* Repeat repo checks

---

## 10. Future (Explicitly Out of Scope Now)

* Authentication
* Saved repos
* Historical tracking
* PDF exports
* Monetization

These exist only to **validate demand**, not build now.

---

## 11. Product Philosophy

> **This tool makes a judgment so humans don’t have to.**

If users disagree with the score, that means it worked — it forced thinking.

---

END OF PRD
