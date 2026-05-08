export type ToolName =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf'

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface ToolInput {
  tool: ToolName
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditFormData {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  tool: ToolName
  currentSpend: number
  recommendedAction: string
  monthlySavings: number
  reason: string
  isOptimal: boolean
}

export interface AuditResult {
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  isHighSavings: boolean
}