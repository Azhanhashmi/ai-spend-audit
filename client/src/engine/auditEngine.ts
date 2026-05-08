import { AuditFormData, AuditResult, ToolRecommendation, ToolInput } from './types'

function auditCursor(tool: ToolInput): ToolRecommendation {
  const { plan, monthlySpend, seats } = tool

  if (plan === 'business' && seats <= 3) {
    const recommended = 20 * seats
    return {
      tool: 'cursor',
      currentSpend: monthlySpend,
      recommendedAction: 'Downgrade to Pro plan',
      monthlySavings: monthlySpend - recommended,
      reason: `Business plan ($40/seat) is designed for large teams. With ${seats} seat(s), Pro ($20/seat) covers all core features and saves $${monthlySpend - recommended}/mo.`,
      isOptimal: false
    }
  }

  if (plan === 'enterprise' && seats <= 10) {
    return {
      tool: 'cursor',
      currentSpend: monthlySpend,
      recommendedAction: 'Downgrade to Business plan',
      monthlySavings: monthlySpend - 40 * seats,
      reason: `Enterprise pricing is for 50+ seat orgs with legal/compliance needs. Business plan at $40/seat covers teams under 10.`,
      isOptimal: false
    }
  }

  return {
    tool: 'cursor',
    currentSpend: monthlySpend,
    recommendedAction: 'No change needed',
    monthlySavings: 0,
    reason: 'You are on the right plan for your team size.',
    isOptimal: true
  }
}

function auditClaude(tool: ToolInput, useCase: string): ToolRecommendation {
  const { plan, monthlySpend, seats } = tool

  if (plan === 'team' && seats <= 2) {
    const recommended = 20 * seats
    return {
      tool: 'claude',
      currentSpend: monthlySpend,
      recommendedAction: 'Switch to individual Pro plans',
      monthlySavings: monthlySpend - recommended,
      reason: `Claude Team ($30/seat, 5 seat minimum) is overkill for ${seats} users. Two Pro plans at $20/seat saves $${monthlySpend - recommended}/mo.`,
      isOptimal: false
    }
  }

  if (plan === 'max' && useCase === 'coding') {
    return {
      tool: 'claude',
      currentSpend: monthlySpend,
      recommendedAction: 'Consider Cursor Pro instead',
      monthlySavings: monthlySpend - 20,
      reason: `For coding workflows, Cursor Pro ($20/mo) includes Claude models with IDE integration. Claude Max ($100/mo) is better for heavy writing or research use cases.`,
      isOptimal: false
    }
  }

  return {
    tool: 'claude',
    currentSpend: monthlySpend,
    recommendedAction: 'No change needed',
    monthlySavings: 0,
    reason: 'Your Claude plan matches your team size and use case.',
    isOptimal: true
  }
}

function auditCopilot(tool: ToolInput): ToolRecommendation {
  const { plan, monthlySpend, seats } = tool

  if (plan === 'enterprise' && seats <= 5) {
    const recommended = 19 * seats
    return {
      tool: 'github_copilot',
      currentSpend: monthlySpend,
      recommendedAction: 'Downgrade to Business plan',
      monthlySavings: monthlySpend - recommended,
      reason: `Copilot Enterprise ($39/seat) adds security features needed by larger orgs. With ${seats} seat(s), Business ($19/seat) has full AI features at half the price.`,
      isOptimal: false
    }
  }

  if (plan === 'business' && seats === 1) {
    return {
      tool: 'github_copilot',
      currentSpend: monthlySpend,
      recommendedAction: 'Switch to Individual plan',
      monthlySavings: monthlySpend - 10,
      reason: 'For solo developers, Individual plan ($10/mo) has identical AI features to Business. Business adds admin controls only relevant for teams.',
      isOptimal: false
    }
  }

  return {
    tool: 'github_copilot',
    currentSpend: monthlySpend,
    recommendedAction: 'No change needed',
    monthlySavings: 0,
    reason: 'Copilot plan is appropriate for your team size.',
    isOptimal: true
  }
}

function auditChatGPT(tool: ToolInput, useCase: string): ToolRecommendation {
  const { plan, monthlySpend, seats } = tool

  if (plan === 'plus' && useCase === 'coding') {
    return {
      tool: 'chatgpt',
      currentSpend: monthlySpend,
      recommendedAction: 'Switch to Cursor Pro for coding',
      monthlySavings: 0,
      reason: `ChatGPT Plus ($20/mo) for coding workflows has no IDE integration. Cursor Pro ($20/mo) gives you the same GPT-4o access inside your editor — same cost, better workflow.`,
      isOptimal: false
    }
  }

  if (plan === 'team' && seats <= 2) {
    return {
      tool: 'chatgpt',
      currentSpend: monthlySpend,
      recommendedAction: 'Switch to individual Plus plans',
      monthlySavings: monthlySpend - 40,
      reason: `ChatGPT Team ($30/seat) requires 2+ seats. Two Plus plans at $20/seat saves $${monthlySpend - 40}/mo with nearly identical features.`,
      isOptimal: false
    }
  }

  return {
    tool: 'chatgpt',
    currentSpend: monthlySpend,
    recommendedAction: 'No change needed',
    monthlySavings: 0,
    reason: 'ChatGPT plan fits your current usage pattern.',
    isOptimal: true
  }
}

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = []

  for (const tool of formData.tools) {
    if (tool.monthlySpend === 0) continue

    let rec: ToolRecommendation

    switch (tool.tool) {
      case 'cursor':
        rec = auditCursor(tool)
        break
      case 'claude':
        rec = auditClaude(tool, formData.useCase)
        break
      case 'github_copilot':
        rec = auditCopilot(tool)
        break
      case 'chatgpt':
        rec = auditChatGPT(tool, formData.useCase)
        break
      default:
        rec = {
          tool: tool.tool,
          currentSpend: tool.monthlySpend,
          recommendedAction: 'No change needed',
          monthlySavings: 0,
          reason: 'Plan appears appropriate for usage.',
          isOptimal: true
        }
    }

    recommendations.push(rec)
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings, 0
  )

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isHighSavings: totalMonthlySavings > 500
  }
}