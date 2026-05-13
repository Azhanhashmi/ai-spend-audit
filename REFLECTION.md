# Reflection

## 1. Hardest bug this week

The hardest bug was the TypeScript module resolution error in the server.
The tsconfig had `"moduleResolution": "node"` which worked in TypeScript 5
but TypeScript 6 deprecated it. The error message was `TS5107: Option
moduleResolution=node is deprecated` but the real problem was that all
my Express imports were silently failing type checking.

My hypothesis was that `@types/express` wasn't installed. I ran
`npm install -D @types/express` but the error persisted. Second hypothesis
was the tsconfig itself. I read the TypeScript 6 migration docs and found
that `"node"` was replaced by `"node10"` for CommonJS projects.
Changing to `"node10"` fixed it, then TypeScript 6 flagged node10 as
deprecated too and required `"ignoreDeprecations": "6.0"`. The fix was
two config lines but took 2 hours to trace because the error message
pointed to the config option, not the actual import failures.

## 2. A decision I reversed mid-week

I originally planned to use Next.js for the entire project (SSR + API routes
in one). Halfway through Day 1 I reversed this and split into separate
React + Express services.

The reason was the audit engine. I wanted the audit logic to be pure
TypeScript functions that could be tested in isolation with Vitest. In Next.js
this is possible but the project structure pushes you toward mixing API logic
with page components. A separate Express backend made it obvious where
business logic lived versus UI logic. The tradeoff is more deployment
complexity (two services instead of one) but the codebase clarity was worth it.

## 3. What I would build in week 2

Week 2 would focus on three things. First, a benchmark mode showing
"your AI spend per developer is $X, companies your size average $Y" —
this requires collecting anonymized data from audits and computing
percentiles. Second, a PDF export of the full audit report that founders
can share with their CFO. Third, an embeddable widget a blogger or
newsletter writer could drop in with a script tag to let their audience
audit directly from the article.

The benchmark feature is the highest leverage — it makes the tool
shareable because people love seeing how they compare to peers.

## 4. How I used AI tools

I used Claude (claude.ai) heavily throughout this week for three things:
debugging TypeScript configuration errors, writing boilerplate Express
middleware, and drafting the GTM and economics sections.

I did not trust AI for the audit engine logic itself. The recommendations
need to be financially defensible — a finance person should read them and
agree. AI-generated rules tend to be plausible-sounding but not grounded
in actual vendor pricing structures. I wrote all audit rules manually after
reading each vendor's pricing page.

One specific time the AI was wrong: I asked Claude to write the MongoDB
schema and it suggested using `String` type for the audit ID reference in
the Lead model instead of `Schema.Types.ObjectId`. This would have broken
the populate query later. I caught it because I know Mongoose and recognized
the type mismatch before it caused a runtime error.

## 5. Self-ratings

**Discipline: 6/10**
Started strong on Day 1 and Day 2 but Day 3 was slower than planned due
to TypeScript setup issues eating into feature-building time.

**Code quality: 7/10**
The audit engine is clean, pure functions, easy to test. The React
components have some inline styles mixed with Tailwind which I would
refactor given more time.

**Design sense: 7/10**
The starfield dark theme looks premium and the layout is clean. The mobile
responsiveness needs more work — some tool cards overflow on small screens.

**Problem-solving: 8/10**
I debugged the TypeScript issues systematically, formed hypotheses and
tested them rather than randomly changing things. The module resolution
fix required reading actual TypeScript 6 release notes.

**Entrepreneurial thinking: 7/10**
The GTM plan has specific weird channels (Lenny's Slack, cold DMing CTOs
who tweeted about AI costs) rather than generic "post on social media."
The economics spreadsheet has real numbers with stated assumptions.
Would score higher if I had more time to do the user interviews properly.