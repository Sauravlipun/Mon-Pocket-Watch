// lib/twitter.js (server side)
// NOTE: server only — do NOT import this into client code

import fetch from 'node-fetch'

export async function getUserByUsername(username) {
  const url = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } })
  if (!r.ok) throw new Error('Twitter user lookup failed: ' + r.status)
  const j = await r.json()
  if (!j.data) throw new Error('Twitter user not found')
  return j.data
}

// Check whether the user follows both target usernames by paging following list
export async function followsTargets(sourceId, targets = ['monad','monadicons']) {
  const headers = { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
  let url = `https://api.twitter.com/2/users/${sourceId}/following?max_results=1000`
  const found = {}
  targets.forEach(t => found[t] = false)

  while (url) {
    const r = await fetch(url, { headers })
    if (!r.ok) throw new Error('Twitter following lookup failed: ' + r.status)
    const j = await r.json()
    const users = j.data || []
    for (const u of users) {
      if (targets.includes(u.username)) found[u.username] = true
    }
    if (Object.values(found).every(Boolean)) return true
    const meta = j.meta || {}
    if (meta.next_token) url = `https://api.twitter.com/2/users/${sourceId}/following?max_results=1000&pagination_token=${meta.next_token}`
    else url = null
  }
  return Object.values(found).every(Boolean)
}
