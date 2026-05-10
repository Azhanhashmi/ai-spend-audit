import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditResult } from '../engine/types'
import { TOOL_LABELS } from '../engine/pricingData'
import { Starfield } from '../components/ui/starfield'

export default function Results() {
  const navigate = useNavigate()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('audit_result')
    if (!saved) { navigate('/'); return }
    setResult(JSON.parse(saved))
  }, [navigate])

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/40 text-sm">
      Loading...
    </div>
  )

  const allOptimal = result.recommendations.every(r => r.isOptimal)
  const hasNonOptimal = result.recommendations.some(r => !r.isOptimal)

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <Starfield
        bgColor="rgba(0,0,0,1)"
        starColor="rgba(255,255,255,0.6)"
        speed={0.2}
        quantity={250}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="text-white/30 hover:text-white/60 text-xs mb-8 flex items-center gap-1.5 transition-colors"
        >
          Back to audit
        </button>

        {/* Hero */}
        <div className={`
          rounded-2xl border p-8 text-center mb-4 backdrop-blur-md
          ${result.isHighSavings
            ? 'bg-emerald-950/40 border-emerald-500/30'
            : 'bg-indigo-950/40 border-indigo-500/30'}
        `}>
          <p className="text-white/40 text-sm mb-2">Potential monthly savings</p>
          <div className={`text-6xl font-black tracking-tight mb-1 ${result.isHighSavings ? 'text-emerald-400' : 'text-indigo-400'}`}>
            ${result.totalMonthlySavings.toFixed(0)}
            <span className="text-2xl font-normal text-white/30">/mo</span>
          </div>
          <p className="text-white/30 text-sm">
            ${result.totalAnnualSavings.toFixed(0)} per year
          </p>
        </div>

        {/* Credex CTA */}
        {result.isHighSavings && (
          <div className="bg-indigo-950/40 border border-indigo-500/25 rounded-2xl p-5 mb-4 flex items-center justify-between gap-4 flex-wrap backdrop-blur-md">
            <div>
              <div className="font-semibold text-sm text-white mb-1">
                You qualify for Credex discounted credits
              </div>
              <div className="text-xs text-white/40">
                Get the same AI tools at 20–40% off through Credex.
              </div>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Book free call
            </a>
          </div>
        )}

        {/* Low savings CTA */}
        {!result.isHighSavings && hasNonOptimal && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 mb-4 backdrop-blur-md">
            <div className="font-semibold text-sm text-white mb-1">
              Get notified when better options apply
            </div>
            <div className="text-xs text-white/40">
              AI tool pricing changes frequently. We will alert you when new savings apply to your stack.
            </div>
          </div>
        )}

        {/* Breakdown */}
        <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-3">
          Breakdown
        </p>

        <div className="space-y-2 mb-4">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className={`
                rounded-xl border-l-2 border p-4 backdrop-blur-md
                ${rec.isOptimal
                  ? 'bg-emerald-950/20 border-l-emerald-500 border-emerald-500/10'
                  : 'bg-red-950/20 border-l-red-500 border-red-500/10'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">
                  {TOOL_LABELS[rec.tool]}
                </span>
                <span className={`text-xs font-semibold ${rec.isOptimal ? 'text-emerald-400' : 'text-red-400'}`}>
                  {rec.isOptimal
                    ? 'Optimal'
                    : rec.monthlySavings > 0
                      ? `Save $${rec.monthlySavings}/mo`
                      : 'Switch plan'}
                </span>
              </div>
              <div className="text-xs text-white/30 mb-1.5">
                Current spend: <span className="text-white/50">${rec.currentSpend}/mo</span>
              </div>
              <div className="text-xs text-white/60 mb-1">
                <span className="text-white/25">Action: </span>{rec.recommendedAction}
              </div>
              <div className="text-xs text-white/35 leading-relaxed">
                {rec.reason}
              </div>
            </div>
          ))}
        </div>

        {/* All optimal */}
        {allOptimal && (
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 mb-4 text-emerald-400 text-sm backdrop-blur-md">
            <strong>You are spending well.</strong> Your AI stack looks optimized.
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-white/50 hover:text-white/70 text-sm font-medium transition-all"
          >
            New Audit
          </button>
          <button
            onClick={handleCopy}
            className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            {copied ? 'Copied!' : 'Share Results'}
          </button>
        </div>

        <p className="text-center text-xs text-white/10 mt-6">
          Powered by Credex · credex.rocks
        </p>
      </div>
    </div>
  )
}