// lib/github.js
import { Octokit } from "@octokit/rest"

export async function appendAllowlistRow({ handle, wallet, meta }) {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!token || !owner || !repo) throw new Error('Github env not configured')

  const octokit = new Octokit({ auth: token })
  const path = 'allowed_users.csv'

  // fetch current
  let current = ''
  let sha = undefined
  try {
    const r = await octokit.repos.getContent({ owner, repo, path, ref: branch })
    if (r && r.data && r.data.content) {
      current = Buffer.from(r.data.content, 'base64').toString('utf8')
      sha = r.data.sha
    }
  } catch (e) {
    // file may not exist - we'll create
  }

  const header = 'handle,wallet,meta,added_at'
  const existingRows = current && current.trim().length ? current.trim().split('\n').slice(1) : []
  // avoid duplicate wallet
  const exists = existingRows.some(r => {
    const cols = r.split(',')
    return cols[1] && cols[1].toLowerCase() === wallet.toLowerCase()
  })
  if (exists) return { ok: true, message: 'already_exists' }

  const now = new Date().toISOString()
  const newRow = `${handle || ''},${wallet},"${JSON.stringify(meta || {})}",${now}`
  const csv = header + '\n' + existingRows.concat(newRow).join('\n')

  await octokit.repos.createOrUpdateFileContents({
    owner, repo, path,
    message: `Add allowed user ${wallet}`,
    content: Buffer.from(csv).toString('base64'),
    branch,
    ...(sha ? { sha } : {})
  })
  return { ok: true }
}
