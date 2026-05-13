import { describe, it, expect } from 'vitest'
import { runAudit } from './auditEngine'

describe('Audit Engine', () => {

  it('recommends downgrade when Cursor Business used by small team', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      useCase: 'coding'
    })
    const rec = result.recommendations[0]
    expect(rec.isOptimal).toBe(false)
    expect(rec.monthlySavings).toBeGreaterThan(0)
    expect(rec.recommendedAction).toContain('Pro')
  })

  it('recommends Claude Pro over Team for 2 users', () => {
    const result = runAudit({
      tools: [{ tool: 'claude', plan: 'team', monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: 'writing'
    })
    const rec = result.recommendations[0]
    expect(rec.isOptimal).toBe(false)
    expect(rec.monthlySavings).toBeGreaterThan(0)
  })

  it('flags Copilot Enterprise for small team', () => {
    const result = runAudit({
      tools: [{ tool: 'github_copilot', plan: 'enterprise', monthlySpend: 195, seats: 5 }],
      teamSize: 5,
      useCase: 'coding'
    })
    const rec = result.recommendations[0]
    expect(rec.isOptimal).toBe(false)
    expect(rec.recommendedAction).toContain('Business')
  })

  it('returns optimal for correctly sized plan', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding'
    })
    const rec = result.recommendations[0]
    expect(rec.isOptimal).toBe(true)
    expect(rec.monthlySavings).toBe(0)
  })

  it('calculates annual savings correctly', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      useCase: 'coding'
    })
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  it('filters out tools with zero spend', () => {
    const result = runAudit({
      tools: [
        { tool: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 },
        { tool: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: 'coding'
    })
    expect(result.recommendations.length).toBe(1)
    expect(result.recommendations[0].tool).toBe('claude')
  })

})