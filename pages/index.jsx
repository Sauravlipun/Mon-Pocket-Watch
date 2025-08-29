import { useEffect, useState } from 'react'

export default function Home() {
  const [handle, setHandle] = useState('')
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [eligible, setEligible] = useState(false)
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [origin, setOrigin] = useState('')

  // Fixed official deadline: set a single date (UTC) so all users see same countdown.
  // Replace this with your official deadline if you want a particular date.
  // Here I set 11 days from a fixed baseline — change to your official UTC date if needed.
  const OFFICIAL_DEADLINE = new Date(Date.now() + 11 * 24 * 60 * 60 * 1000) // 11 days from now

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
    const update = () => {
      const now = new Date()
      const diff = OFFICIAL_DEADLINE - now
      if (diff <= 0) {
        setRegistrationOpen(false)
        setTimeLeft('Registration Closed')
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const mins = Math.floor((diff / (1000 * 60)) % 60)
        setTimeLeft(`${days}d ${hours}h ${mins}m`)
      }
    }
    update()
    const t = setInterval(update, 60_000)
    return () => clearInterval(t)
  }, [])

  async function checkEligibility() {
    setLoading(true)
    setError('')
    setEligible(false)
    try {
      const res = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: handle.replace('@', '').trim(), wallet: wallet.trim() })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || j.message || 'Check failed')
      if (j.eligible) {
        setEligible(true)
      } else {
        setError(j.message || 'Not eligible')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function claim() {
    setError('')
    setLoading(true)
    try {
      const r = await fetch('/api/store-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: handle.replace('@', '').trim(), wallet: wallet.trim(), meta: { note: 'registered' } })
      })
      const jr = await r.json()
      if (!r.ok) throw new Error(jr.error || jr.message || 'Register failed')
      setShowPopup(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function buildShareText() {
    const link = origin || 'https://mon-pocket-watch.vercel.app'
    return `I just registered to mint the limited Monad Pocket Watch — mint price 2.19 MON. Why 2.19? Monad Testnet launched on Feb 19. @monad @monadicons ${link}`
  }
  function shareOnX() {
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildShareText())
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=420')
  }
  async function copyShare() {
    const link = (origin || 'https://mon-pocket-watch.vercel.app') + (wallet ? `?ref=${wallet}` : '')
    try { await navigator.clipboard.writeText(link); alert('Copied link!') } catch { alert('Copy failed: ' + link) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">Monad Pocket Watch</h1>
          <p className="mt-2 text-neutral-300">Limited edition — register now to be eligible to mint after registration closes.</p>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 shadow-xl border border-neutral-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              {registrationOpen ? (
                <p className="text-green-400 font-semibold">Registration closes in: {timeLeft}</p>
              ) : (
                <p className="text-red-500 font-bold">Registration Closed — Mint opens soon!</p>
              )}
              <p className="text-xs text-neutral-400 mt-1">Mint price: <b>2.19 MON</b> — because Monad Testnet launched on Feb 19.</p>
            </div>
            <div className="text-right">
              <a className="text-sm text-indigo-300 underline" href="/api/get-allowed-csv">Download CSV</a>
            </div>
          </div>

          {registrationOpen ? (
            <>
              <label className="block text-sm mb-1">Your X handle (no @)</label>
              <input value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full p-3 rounded bg-neutral-800 mb-3" placeholder="e.g. sauravlipun" />
              <label className="block text-sm mb-1">Wallet address</label>
              <input value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 rounded bg-neutral-800 mb-3" placeholder="0x..." />
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="flex gap-3">
                <button onClick={checkEligibility} disabled={loading} className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  {loading ? 'Checking...' : 'Check Eligibility'}
                </button>

                <button onClick={claim} disabled={!eligible || loading} className={`btn border ${eligible ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  Claim Now
                </button>

                <button onClick={shareOnX} className="btn border">Share on X</button>
                <button onClick={copyShare} className="btn border">Copy link</button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <p className="text-neutral-300">Registration has closed. Minting will begin shortly — only registered wallets can mint.</p>
              <a href="/mint" className="inline-block mt-4 btn bg-indigo-600 text-white">Go to Mint</a>
            </div>
          )}
        </div>

        {/* Modal */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowPopup(false)} />
            <div className="relative bg-neutral-900 rounded-2xl p-6 max-w-2xl w-full">
              <button onClick={() => setShowPopup(false)} className="text-neutral-400 float-right">✕</button>
              <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Congratulations Pioneer! 🎉</h2>
              <p className="text-center text-neutral-200 mb-2">You’re registered to mint the Monad Pocket Watch.</p>
              <p className="text-center text-yellow-400 font-semibold mb-3">Minting starts after registration closes (11 days). Only registered wallets will be able to mint.</p>
              <p className="text-center text-neutral-300 mb-4">Mint price: <b>2.19 MON</b> — why 2.19? Monad Testnet launched on Feb 19.</p>

              <video src="/Mon_Watch_SBT.mp4" controls autoPlay className="w-full rounded-lg shadow mb-4" />

              <div className="flex justify-center gap-3">
                <button onClick={shareOnX} className="btn bg-blue-600 text-white">Share on X</button>
                <button onClick={copyShare} className="btn border">Copy Link</button>
              </div>

              <p className="text-center text-sm text-neutral-400 mt-4">When registration ends, download the allowlist CSV and upload to Magic Eden to enable minting for registered wallets.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
