// pages/api/check-transactions.js
import { getTxCount } from '../../lib/blockvision'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { wallet } = req.body
    if (!wallet) return res.status(400).json({ error: 'wallet required' })

    if (!process.env.BLOCKVISION_API_KEY) return res.status(500).json({ error: 'BLOCKVISION_API_KEY not configured' })
    const txCount = await getTxCount(wallet)
    return res.status(200).json({ txCount })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
