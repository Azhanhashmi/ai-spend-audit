import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TOOL_LABELS } from '../engine/pricingData'
import { Starfield } from '../components/ui/starfield'

export default function SharedAudit() {
  const { id } = useParams()
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/audit/${id}`)
      .then(r => r.json())
      .then(data => { setAudit(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/40 text-sm">
      Loading audit...
    </div>
  )

  if (!audit) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/40 text-sm">
      Audit not found.
    </div>
  )

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <Starfield bgColor="rgba(0,0,0,1)" starColor="rgba(255,255,255,0.6)" speed={0.2} quantity={200} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        <div className="text-xs text-white/25 mb-6">Shared audit · credex.rocks</div>

        <div className="rounded-2xl border bg-indigo-950/40 border-indigo-500/30 p-8 text-center mb-4 backdrop-blur-md">
          <p className="text-white/40 text-sm mb-2">This team could save</p>
          <div className="text-6xl font-black tracking-tight mb-1 text-indigo-400">
            ${audit.totalMonthlySavings?.toFixed(0)}
            <span className="text-2xl font-normal text-white/30">/mo</span>
          </div>
          <p className="text-white/30 text-sm">${audit.totalAnnualSavings?.toFixed(0)} per year</p>
        </div>

        {audit.aiSummary && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 mb-4 backdrop-blur-md">
            <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-2">Summary</p>
            <p className="text-sm text-white/60 leading-relaxed">{audit.aiSummary}</p>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {audit.recommendations?.map((rec: any, i: number) => (
            <div key={i} className={`rounded-xl border-l-2 border p-4 backdrop-blur-md ${rec.isOptimal ? 'bg-emerald-950/20 border-l-emerald-500 border-emerald-500/10' : 'bg-red-950/20 border-l-red-500 border-red-500/10'}`}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-white">{TOOL_LABELS[rec.tool] ?? rec.tool}</span>
                <span className={`text-xs font-semibold ${rec.isOptimal ? 'text-emerald-400' : 'text-red-400'}`}>
                  {rec.isOptimal ? 'Optimal' : rec.monthlySavings > 0 ? `Save $${rec.monthlySavings}/mo` : 'Switch plan'}
                </span>
              </div>
              <div className="text-xs text-white/40">{rec.reason}</div>
            </div>
          ))}
        </div>

        
        <a href="/"
          className="block w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
        >
          Audit my own AI spend
        </a>
      </div>
    </div>
  )
}