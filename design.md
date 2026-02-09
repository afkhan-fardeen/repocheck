1️⃣ Visual Direction (Lock This In)
UI Personality

Serious, calm, confident

Not playful

Not crypto

Not “developer toy”

Think:

“This looks like something a CTO would trust.”

4
2️⃣ Design Tokens (Non-Negotiable)
Color Palette

Use very few colors.

Background: #0B0D10 (dark) or #FFFFFF (light)
Surface: #111418
Border: #1F2937
Primary: #6366F1 (indigo)
Accent (risk): #F59E0B (amber)
Danger: #EF4444
Success: #10B981
Text Primary: #E5E7EB
Text Muted: #9CA3AF


Rule: If everything is colored, nothing is important

Typography

Use one font family only.

Best options:

Inter (safe, SaaS standard)

DM Sans (slightly more modern)

Manrope (clean, premium)

Font scale:

H1: 40–48px (landing hero)

H2: 24–28px

Body: 14–16px

Labels: 12px

No fancy font mixing.

3️⃣ Page-by-Page UI Blueprint
🟦 Landing Page (/)
Hero Section

Left-aligned. No center alignment.

[Headline]
Know if a GitHub repo is safe in 60 seconds

[Subtext]
Instantly assess maintainability, risk, and takeover readiness.
No login. Free.

[Input Field]  [Analyze Repo →]


Input style:

Large

Rounded (12px)

Subtle border

Focus glow (primary color)

Trust Section (Silent Credibility)

Instead of logos, show principles:

No vanity metrics

Risk-focused scoring

Judgment-based analysis

Built for founders & buyers

This builds trust without social proof.

Example Report Preview

Static mock:

Health score

One risk

One strength

This reduces anxiety.

🟦 Report Page (/report/:repo)

This is your money page.

Header

Minimal:

owner / repo-name
Primary language · Stars (small, muted)

Health Score Card (Hero)

Big number. Everything else secondary.

72 / 100
Moderate Risk

Short one-liner:
“This repo is usable but has takeover risk.”


Use:

soft gradient background

subtle glow

no charts

Risk & Strength Cards (MOST IMPORTANT)

Two columns:

⚠️ Primary Risks

Single-maintainer dependency

Weak deployment documentation

✅ Strengths

Consistent maintenance

CI pipeline present

Cards:

light border

subtle shadow

no icons overload (1 emoji max)

Score Breakdown (Optional Expand)

Collapsed by default.

Each score:

Bus Factor        6 / 20
Maintenance      14 / 20
Dependencies     13 / 20
Ops Readiness    18 / 20
Ownership        21 / 20


No charts. Numbers + text.

Verdict Section (Narrative)

Plain English paragraph:

“If this repository were acquired today, the biggest risk would be contributor concentration. Stabilization would likely require 2–3 weeks.”

This is what makes it feel premium.

4️⃣ UI Components You Need (Only These)

Do NOT overbuild.

Core Components

<Card />

<Badge />

<ScorePill />

<RiskItem />

<StrengthItem />

<RepoInput />

<LoadingState />

That’s it.

5️⃣ Motion & Interaction (Framer-Style, Minimal)

Rules:

Motion only on entry

No continuous animation

No bounce

No parallax

Allowed:

Fade + slight slide (8–12px)

Score count-up (once)

Button hover glow

If animation draws attention → remove it.

6️⃣ Dark Mode (DO IT)

Default to dark mode.
Add light mode toggle later if needed.

Dark mode:

feels more “infra / dev”

hides imperfections

looks premium faster

7️⃣ What Makes It Feel “Paid”

These details matter more than features:

Empty states with copy

Loading text (“Analyzing dependencies…”)

Opinionated wording

Tight spacing

Consistent border radius (8–12px)

No lorem ipsum anywhere

8️⃣ Stack-Specific UI Recommendation
If Next.js

Tailwind CSS

shadcn/ui (cards, badges)

Server Components for report page

If SvelteKit

Tailwind CSS

Skeleton UI or custom components

Server load for reports

Do NOT use MUI / Ant / Bootstrap
They kill the Framer feel instantly.

Final UI Rule (Read This Twice)

If a UI element does not reduce decision time, it should not exist.

Your product is about judgment, not interaction.