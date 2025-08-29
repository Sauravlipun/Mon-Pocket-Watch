// pages/api/health.js
export default async function handler(req, res) {
  const ok = {
    node: true,
    envs: {
      blockvision: !!process.env.BLOCKVISION_API_KEY,
      twitter: !!process.env.TWITTER_BEARER_TOKEN,
      github: !!process.env.GITHUB_TOKEN
    }
  }
  res.status(200).json(ok)
}
