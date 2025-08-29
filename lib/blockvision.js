// lib/blockvision.js
import fetch from 'node-fetch'

const DEFAULT_BASE = process.env.BLOCKVISION_API_BASE || 'https://monad-testnet.blockvision.org'

// small in-memory cache to protect CU usage
const txCache = new Map()
function getCache(k){ const v = txCache.get(k); if(!v) return null; if(Date.now()>v.expires){ txCache.delete(k); return null } return v.count }
function setCache(k,c,ttl=5*60*1000){ txCache.set(k,{count:c,expires:Date.now()+ttl}) }

export async function getTxCount(address) {
  const cached = getCache(address)
  if (cached !== null) return cached

  const apiKey = process.env.BLOCKVISION_API_KEY
  if (!apiKey) throw new Error('BLOCKVISION_API_KEY not configured')

  // quick request for limit=1 to get total
  const url = `${DEFAULT_BASE.replace(/\/$/,'')}/v2/monad/account/transactions?address=${encodeURIComponent(address)}&limit=1`
  const r = await fetch(url, { headers: { 'x-api-key': apiKey, accept: 'application/json' } })
  if (!r.ok) {
    const txt = await r.text().catch(()=>null)
    throw new Error('BlockVision error ' + r.status + (txt ? ' - ' + txt.slice(0,200) : ''))
  }
  const j = await r.json()
  // common locations
  const total = j?.total ?? j?.data?.total ?? j?.result?.total ?? j?.data?.items?.total ?? null
  if (typeof total === 'number') { setCache(address,total); return total }

  // fallback to paged counting (limit max 50)
  let count = 0, cursor = null, safety = 0
  do {
    const pageUrl = new URL(`${DEFAULT_BASE.replace(/\/$/,'')}/v2/monad/account/transactions`)
    pageUrl.searchParams.set('address', address)
    pageUrl.searchParams.set('limit','50')
    if (cursor) pageUrl.searchParams.set('cursor', cursor)
    const rr = await fetch(pageUrl.toString(), { headers: { 'x-api-key': apiKey, accept: 'application/json' } })
    if (!rr.ok) break
    const jj = await rr.json()
    const items = jj?.data ?? jj?.result ?? jj?.data?.items ?? jj?.items ?? []
    const arr = Array.isArray(items) ? items : (Array.isArray(items?.items) ? items.items : [])
    count += (Array.isArray(arr) ? arr.length : 0)
    cursor = jj?.nextPageCursor ?? jj?.data?.nextPageCursor ?? jj?.result?.nextPageCursor ?? null
    safety++; if (safety>500) break
  } while (cursor)
  setCache(address,count)
  return count
}
