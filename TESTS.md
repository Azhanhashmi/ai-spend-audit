# Tests

All tests are in `client/src/engine/auditEngine.test.ts`

Run with:
\`\`\`bash
cd client
npm test -- --run
\`\`\`

## Test Coverage

| Test | File | What it covers |
|---|---|---|
| Cursor Business downgrade | auditEngine.test.ts | Small team on oversized plan gets Pro recommendation |
| Claude Team to Pro | auditEngine.test.ts | 2-user Team plan should downgrade to individual Pro plans |
| Copilot Enterprise flag | auditEngine.test.ts | Small team on Enterprise gets Business recommendation |
| Optimal plan detection | auditEngine.test.ts | Correctly sized plan returns isOptimal: true |
| Annual savings calculation | auditEngine.test.ts | totalAnnualSavings === totalMonthlySavings × 12 |
| Zero spend filtering | auditEngine.test.ts | Tools with $0 spend are excluded from recommendations |