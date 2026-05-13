# LLM Prompts

## Audit Summary Prompt

Used in: `server/src/services/anthropic.service.ts`
## Why this prompt works
- Gives full context upfront so the model doesn't hallucinate numbers
- Constrains length to ~100 words to prevent rambling
- Asks for one specific action — makes the output actionable not generic
- "No fluff" instruction removes filler phrases like "In conclusion..."

## What didn't work
- Without the word count constraint, summaries were 200+ words and lost impact
- Asking for "friendly tone" produced overly casual output inappropriate for B2B
- Not including the recommendations list caused generic summaries with no specifics