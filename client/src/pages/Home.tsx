import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditFormData, ToolInput, ToolName, UseCase } from '../engine/types'
import { runAudit } from '../engine/auditEngine'
import { PRICING, TOOL_LABELS } from '../engine/pricingData'
import { Starfield } from '../components/ui/starfield'

const TOOLS: ToolName[] = [
  'cursor', 'github_copilot', 'claude', 'chatgpt',
  'anthropic_api', 'openai_api', 'gemini', 'windsurf'
]

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed']
const STORAGE_KEY = 'audit_form_data'

function loadSaved(): AuditFormData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return {
    tools: TOOLS.map(tool => ({
      tool,
      plan: Object.keys(PRICING[tool])[0],
      monthlySpend: 0,
      seats: 1,
    })),
    teamSize: 1,
    useCase: 'coding',
  }
}

export default function Home() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<AuditFormData>(loadSaved)

  function save(data: AuditFormData) {
    setFormData(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function updateTool(index: number, field: keyof ToolInput, value: string | number) {
    const updated = { ...formData, tools: [...formData.tools] }
    updated.tools[index] = { ...updated.tools[index], [field]: value }
    save(updated)
  }

  function toggleTool(index: number, active: boolean) {
    const updated = { ...formData, tools: [...formData.tools] }
    const tool = updated.tools[index]
    const defaultPrice =
      Object.values(PRICING[tool.tool])[1]?.price ??
      Object.values(PRICING[tool.tool])[0]?.price ?? 20
    updated.tools[index] = { ...tool, monthlySpend: active ? defaultPrice : 0 }
    save(updated)
  }

  function handleSubmit() {
    const active = formData.tools.filter(t => t.monthlySpend > 0)
    if (active.length === 0) return
    const result = runAudit(formData)
    localStorage.setItem('audit_result', JSON.stringify(result))
    navigate('/results')
  }

  const activeCount = formData.tools.filter(t => t.monthlySpend > 0).length
  const totalSpend = formData.tools.reduce((s, t) => s + t.monthlySpend, 0)

  const inputCls = `
    w-full bg-black/40 border border-white/10 rounded-lg
    px-3 py-2 text-sm text-white placeholder-white/20
    focus:outline-none focus:border-indigo-500/60
    transition-colors backdrop-blur-sm
  `

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <Starfield
        bgColor="rgba(0,0,0,1)"
        starColor="rgba(255,255,255,0.85)"
        speed={0.4}
        quantity={350}
      />

      {/* Overlay gradient so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      <div className="relative z-10">

        {/* Navbar */}
        <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="font-semibold text-sm tracking-tight">AI Spend Audit</span>
          </div>
          <span className="text-xs text-white/25 border border-white/10 px-3 py-1 rounded-full">
            Free · No signup
          </span>
        </nav>

        {/* Hero */}
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-10 text-center">
          <div className="inline-block text-xs font-medium text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-full mb-6">
            Free AI spend analysis
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-4 text-white">
            Stop overpaying<br />
            <span className="text-white/40">for AI tools</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto">
            Enter what your team pays and get an instant audit showing exactly where you're wasting money.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 pb-20 space-y-3">

          {/* Team Info */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              Team Info
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[100px]">
                <label className="block text-xs text-white/40 mb-1.5">Team Size</label>
                <input
                  type="number" min={1}
                  value={formData.teamSize}
                  onChange={e => save({ ...formData, teamSize: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
              <div className="flex-[2] min-w-[160px]">
                <label className="block text-xs text-white/40 mb-1.5">Primary Use Case</label>
                <select
                  value={formData.useCase}
                  onChange={e => save({ ...formData, useCase: e.target.value as UseCase })}
                  className={inputCls}
                >
                  {USE_CASES.map(u => (
                    <option key={u} value={u}>
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
                Your AI Tools
              </p>
              {activeCount > 0 && (
                <span className="text-xs text-indigo-400 font-medium">
                  {activeCount} selected · ${totalSpend}/mo
                </span>
              )}
            </div>

            <div className="space-y-2">
              {formData.tools.map((tool, i) => {
                const isActive = tool.monthlySpend > 0
                return (
                  <div
                    key={tool.tool}
                    className={`
                      rounded-xl border px-4 py-3 transition-all duration-150
                      ${isActive
                        ? 'bg-indigo-500/5 border-indigo-500/30'
                        : 'bg-transparent border-white/5 opacity-50 hover:opacity-70'}
                    `}
                  >
                    <div className="flex items-center gap-3 flex-wrap">

                      {/* Checkbox + Name */}
                      <div className="flex items-center gap-2.5 w-36 shrink-0">
                        <input
                          type="checkbox"
                          id={`t-${tool.tool}`}
                          checked={isActive}
                          onChange={e => toggleTool(i, e.target.checked)}
                          className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                        />
                        <label
                          htmlFor={`t-${tool.tool}`}
                          className="text-sm font-medium cursor-pointer text-white/80 truncate"
                        >
                          {TOOL_LABELS[tool.tool]}
                        </label>
                      </div>

                      {isActive ? (
                        <div className="flex gap-2 flex-1 flex-wrap">
                          {/* Plan */}
                          <div className="flex-1 min-w-[110px]">
                            <div className="text-[10px] text-white/30 mb-1">Plan</div>
                            <select
                              value={tool.plan}
                              onChange={e => updateTool(i, 'plan', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                            >
                              {Object.entries(PRICING[tool.tool]).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Monthly Spend */}
                          <div className="w-24">
                            <div className="text-[10px] text-white/30 mb-1">$/mo</div>
                            <input
                              type="number" min={0}
                              value={tool.monthlySpend}
                              onChange={e => updateTool(i, 'monthlySpend', Number(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                            />
                          </div>

                          {/* Seats */}
                          <div className="w-16">
                            <div className="text-[10px] text-white/30 mb-1">Seats</div>
                            <input
                              type="number" min={1}
                              value={tool.seats}
                              onChange={e => updateTool(i, 'seats', Number(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-white/20 ml-1">Not in your stack</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={activeCount === 0}
            className={`
              w-full py-4 rounded-xl text-sm font-semibold
              transition-all duration-200 tracking-wide
              ${activeCount > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-white/20 cursor-not-allowed'}
            `}
          >
            {activeCount > 0
              ? `Audit ${activeCount} tool${activeCount > 1 ? 's' : ''} ${totalSpend > 0 ? `· $${totalSpend}/mo` : ''}`
              : 'Select at least one tool to continue'}
          </button>

          <p className="text-center text-xs text-white/15 pt-1">
            No account required · Results in seconds · Powered by Credex
          </p>
        </div>
      </div>
    </div>
  )
}