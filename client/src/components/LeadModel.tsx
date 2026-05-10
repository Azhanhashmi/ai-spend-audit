import { useState } from 'react'

interface Props {
  auditId: string | null
  totalSavings: number
  onClose: () => void
}

export default function LeadModal({ auditId, totalSavings, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, companyName: company, role, auditId, totalMonthlySavings: totalSavings })
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-emerald-400 text-lg font-semibold mb-2">Done!</div>
            <p className="text-white/50 text-sm mb-4">
              We have sent your audit report to {email}.
            </p>
            <button onClick={onClose} className="text-white/30 text-sm hover:text-white/60">
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-white mb-1">Get your report by email</h3>
            <p className="text-xs text-white/40 mb-5">
              We will send a copy of this audit and notify you of new savings.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60"
              />
              <input
                type="text"
                placeholder="Company name (optional)"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60"
              />
              <input
                type="text"
                placeholder="Your role (optional)"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!email || loading}
                className="flex-[2] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {loading ? 'Sending...' : 'Send my report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}