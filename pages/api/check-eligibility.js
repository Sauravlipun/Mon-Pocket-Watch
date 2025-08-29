// pages/api/check-eligibility.js
// wrapper that checks twitter follows + txcount
import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { handle, wallet } = req.body
    if (!wallet) return res.status(400).json({ error: 'wallet required' })

    // call internal endpoints directly (avoid exposing secrets)
    // Twitter check (optional if handle empty => skip)
    let followsBoth = true, twitterDetail = {}
    if (handle && handle.trim().length > 0) {
      const tRes = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''}/api/check-twitter`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ handle })
      })
      twitterDetail = await tRes.json().catch(()=>({ error:'twitter check failed' }))
      followsBoth = twitterDetail.followsBoth === true
    }

    // tx check
    const txRes = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''}/api/check-transactions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet })
    })
    const txJson = await txRes.json().catch(()=>({ txCount:0 }))
    const txCount = typeof txJson.txCount === 'number' ? txJson.txCount : 0

    const meetsTx = txCount >= 5000
    const eligible = (handle ? followsBoth : true) && meetsTx
    const message = eligible ? 'Eligible' : `Not eligible: ${(handle && !followsBoth) ? 'Twitter follows missing. ' : ''}${!meetsTx ? `txs ${txCount} (need 5000+)` : ''}`
    return res.status(200).json({ eligible, message, reason: { twitter: twitterDetail, transactions: { txCount } } })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
