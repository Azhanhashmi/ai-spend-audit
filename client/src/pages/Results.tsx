import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditResult } from '../engine/types'
import { TOOL_LABELS } from '../engine/pricingData'

export default function Results() {
  const navigate = useNavigate()
  const [result, setResult] = useState<AuditResult | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('audit_result')
    if (!saved) { navigate('/'); return }
    setResult(JSON.parse(saved))
  }, [navigate])

  if (!result) return <div style={{ padding: '2rem' }}>Loading...</div>

  const hasNonOptimal = result.recommendations.some(r => !r.isOptimal)
  const allOptimal = result.recommendations.every(r => r.isOptimal)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>

      {/* Hero Savings */}
      <div style={{
        background: result.isHighSavings ? '#0f5132' : '#1a1a1a',
        color: 'white',
        borderRadius: 12,
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <p style={{ margin: 0, opacity: 0.8 }}>You could save</p>
        <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>
          ${result.totalMonthlySavings.toFixed(0)}/month
        </h1>
        <p style={{ opacity: 0.8, margin: 0 }}>
          ${result.totalAnnualSavings.toFixed(0)} per year
        </p>
      </div>

      {/* Credex CTA — only for high savings */}
      {result.isHighSavings && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: 8,
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <strong>💡 You qualify for Credex credits</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            With $500+/mo in potential savings, you could get discounted AI credits
            through Credex and save even more.{' '}
            <a href="https://credex.rocks" target="_blank" rel="noreferrer">
              Book a free consultation →
            </a>
          </p>
        </div>
      )}

      {/* Low savings CTA */}
      {!result.isHighSavings && hasNonOptimal && result.totalMonthlySavings > 0 && (
        <div style={{
          background: '#e8f4fd',
          border: '1px solid #90caf9',
          borderRadius: 8,
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <strong>📬 Want updates when new savings apply?</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: 14 }}>
            AI tool pricing changes frequently. We'll notify you when better options
            become available for your stack.
          </p>
        </div>
      )}

      {/* Per Tool Breakdown */}
      <h2 style={{ marginBottom: '1rem' }}>Your Audit Results</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {result.recommendations.map((rec, i) => (
          <div key={i} style={{
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            borderLeft: `4px solid ${rec.isOptimal ? '#28a745' : '#dc3545'}`
          }}>
            {/* Tool name + status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <strong style={{ fontSize: 16 }}>{TOOL_LABELS[rec.tool]}</strong>
              <span style={{
                color: rec.isOptimal ? '#28a745' : '#e65100',
                fontWeight: 600,
                fontSize: 14
              }}>
                {rec.isOptimal
                  ? '✓ Optimal'
                  : rec.monthlySavings > 0
                    ? `Save $${rec.monthlySavings}/mo`
                    : '⚠ Switch plan'}
              </span>
            </div>

            {/* Current spend */}
            <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
              Current spend: <strong>${rec.currentSpend}/mo</strong>
            </div>

            {/* Recommended action */}
            <div style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>
              <strong>Action:</strong> {rec.recommendedAction}
            </div>

            {/* Reason */}
            <div style={{ fontSize: 13, color: '#666' }}>
              {rec.reason}
            </div>
          </div>
        ))}
      </div>

      {/* Already optimal message */}
      {allOptimal && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#d4edda',
          borderRadius: 8
        }}>
          ✅ <strong>You're spending well.</strong> Your current AI stack looks optimized.
        </div>
      )}

      {/* Share button placeholder */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          ← Run Another Audit
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied!')
          }}
          style={{
            padding: '0.8rem 1.5rem',
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Share Results →
        </button>
      </div>
    </div>
  )
}