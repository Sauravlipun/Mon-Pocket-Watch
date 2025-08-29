// pages/api/store-csv.js
import { appendAllowlistRow } from '../../lib/github'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { handle, wallet, meta } = req.body
    if (!wallet) return res.status(400).json({ error: 'wallet required' })
    const r = await appendAllowlistRow({ handle, wallet, meta })
    res.status(200).json(r)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
