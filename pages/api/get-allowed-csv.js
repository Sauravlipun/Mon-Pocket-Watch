// pages/api/get-allowed-csv.js
import { Octokit } from "@octokit/rest"

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    const branch = process.env.GITHUB_BRANCH || 'main'
    if (!token || !owner || !repo) return res.status(500).json({ error: 'Github env not configured' })
    const octokit = new Octokit({ auth: token })
    try {
      const r = await octokit.repos.getContent({ owner, repo, path: 'allowed_users.csv', ref: branch })
      const content = Buffer.from(r.data.content, 'base64').toString('utf8')
      res.setHeader('Content-Type','text/csv')
      res.setHeader('Content-Disposition','attachment; filename="allowed_users.csv"')
      return res.status(200).send(content)
    } catch (e) {
      return res.status(404).json({ error: 'allowed_users.csv not found' })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
