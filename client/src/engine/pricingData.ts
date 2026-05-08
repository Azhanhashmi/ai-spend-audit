export const PRICING = {
  cursor: {
    hobby: { price: 0, label: 'Hobby (Free)' },
    pro: { price: 20, label: 'Pro' },
    business: { price: 40, label: 'Business' },
    enterprise: { price: 100, label: 'Enterprise (est.)' }
  },
  github_copilot: {
    individual: { price: 10, label: 'Individual' },
    business: { price: 19, label: 'Business' },
    enterprise: { price: 39, label: 'Enterprise' }
  },
  claude: {
    free: { price: 0, label: 'Free' },
    pro: { price: 20, label: 'Pro' },
    max: { price: 100, label: 'Max' },
    team: { price: 30, label: 'Team (per seat)' },
    enterprise: { price: 60, label: 'Enterprise (est. per seat)' }
  },
  chatgpt: {
    free: { price: 0, label: 'Free' },
    plus: { price: 20, label: 'Plus' },
    team: { price: 30, label: 'Team (per seat)' },
    enterprise: { price: 60, label: 'Enterprise (est. per seat)' }
  },
  anthropic_api: {
    payg: { price: 0, label: 'Pay as you go' }
  },
  openai_api: {
    payg: { price: 0, label: 'Pay as you go' }
  },
  gemini: {
    free: { price: 0, label: 'Free' },
    pro: { price: 19.99, label: 'Google One AI Premium' },
    enterprise: { price: 30, label: 'Workspace (est. per seat)' }
  },
  windsurf: {
    free: { price: 0, label: 'Free' },
    pro: { price: 15, label: 'Pro' },
    team: { price: 35, label: 'Team (per seat)' }
  }
}

export const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf'
}