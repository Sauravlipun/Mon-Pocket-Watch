// pages/api/check-twitter.js
import { getUserByUsername, followsTargets } from '../../lib/twitter'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { handle } = req.body
    if (!handle) return res.status(400).json({ error: 'handle required' })
    if (!process.env.TWITTER_BEARER_TOKEN) return res.status(500).json({ error: 'TWITTER_BEARER_TOKEN not configured' })

    const user = await getUserByUsername(handle.replace('@','').trim())
    const ok = await followsTargets(user.id, ['monad','monadicons'])
    return res.status(200).json({ followsBoth: ok })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
