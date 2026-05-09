import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditFormData, ToolInput, ToolName, UseCase } from '../engine/types'
import { runAudit } from '../engine/auditEngine'
import { PRICING, TOOL_LABELS } from '../engine/pricingData'

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
      seats: 1
    })),
    teamSize: 1,
    useCase: 'coding'
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
    const updated = { ...formData }
    updated.tools = [...formData.tools]
    updated.tools[index] = { ...updated.tools[index], [field]: value }
    save(updated)
  }

  function toggleTool(index: number, active: boolean) {
    const updated = { ...formData }
    updated.tools = [...formData.tools]
    const tool = updated.tools[index]
    const defaultPrice = Object.values(PRICING[tool.tool])[1]?.price ?? 
                         Object.values(PRICING[tool.tool])[0]?.price ?? 20
    updated.tools[index] = {
      ...tool,
      monthlySpend: active ? defaultPrice : 0
    }
    save(updated)
  }

  function handleSubmit() {
    const activeTools = formData.tools.filter(t => t.monthlySpend > 0)
    if (activeTools.length === 0) {
      alert('Please enter spend for at least one tool.')
      return
    }
    const result = runAudit(formData)
    localStorage.setItem('audit_result', JSON.stringify(result))
    navigate('/results')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        AI Spend Audit
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Find out where your team is overspending on AI tools — free, instant, no login required.
      </p>

      {/* Team Info */}
      <div style={{
        marginBottom: '2rem', padding: '1rem',
        background: '#f9f9f9', borderRadius: 8
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Team</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label>Team Size</label><br />
            <input
              type="number"
              min={1}
              value={formData.teamSize}
              onChange={e => save({ ...formData, teamSize: Number(e.target.value) })}
              style={{ padding: '0.5rem', width: 80, marginTop: 4 }}
            />
          </div>
          <div>
            <label>Primary Use Case</label><br />
            <select
              value={formData.useCase}
              onChange={e => save({ ...formData, useCase: e.target.value as UseCase })}
              style={{ padding: '0.5rem', marginTop: 4 }}
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
      <h2 style={{ marginBottom: '0.5rem' }}>Your AI Tools</h2>
      <p style={{ fontSize: 13, color: '#888', marginBottom: '1rem' }}>
        Toggle the tools your team currently pays for and enter your actual spend.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formData.tools.map((tool, i) => {
          const isActive = tool.monthlySpend > 0
          return (
            <div key={tool.tool} style={{
              padding: '1rem',
              border: `1px solid ${isActive ? '#1a1a1a' : '#e0e0e0'}`,
              borderRadius: 8,
              background: isActive ? '#fff' : '#fafafa',
              opacity: isActive ? 1 : 0.6,
              transition: 'all 0.2s'
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '1rem', flexWrap: 'wrap'
              }}>

                {/* Toggle + Tool Name */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 8, minWidth: 180
                }}>
                  <input
                    type="checkbox"
                    id={`toggle-${tool.tool}`}
                    checked={isActive}
                    onChange={e => toggleTool(i, e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <label
                    htmlFor={`toggle-${tool.tool}`}
                    style={{ fontWeight: 600, cursor: 'pointer' }}
                  >
                    {TOOL_LABELS[tool.tool]}
                  </label>
                </div>

                {/* Plan, Spend, Seats — only editable when active */}
                {isActive && (
                  <>
                    <div>
                      <label style={{ fontSize: 12, color: '#888' }}>Plan</label><br />
                      <select
                        value={tool.plan}
                        onChange={e => updateTool(i, 'plan', e.target.value)}
                        style={{ padding: '0.4rem', marginTop: 2 }}
                      >
                        {Object.entries(PRICING[tool.tool]).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#888' }}>
                        Monthly Spend ($)
                      </label><br />
                      <input
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={e => updateTool(i, 'monthlySpend', Number(e.target.value))}
                        style={{ padding: '0.4rem', width: 100, marginTop: 2 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#888' }}>Seats</label><br />
                      <input
                        type="number"
                        min={1}
                        value={tool.seats}
                        onChange={e => updateTool(i, 'seats', Number(e.target.value))}
                        style={{ padding: '0.4rem', width: 70, marginTop: 2 }}
                      />
                    </div>
                  </>
                )}

                {!isActive && (
                  <span style={{ fontSize: 13, color: '#aaa' }}>
                    Not in your stack
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Active tool count */}
      <p style={{ marginTop: '1rem', fontSize: 13, color: '#888' }}>
        {formData.tools.filter(t => t.monthlySpend > 0).length} tool(s) selected
      </p>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '1rem', padding: '1rem 2rem',
          background: '#1a1a1a', color: 'white',
          border: 'none', borderRadius: 8,
          fontSize: '1rem', cursor: 'pointer', width: '100%'
        }}
      >
        Run My Audit →
      </button>
    </div>
  )
}