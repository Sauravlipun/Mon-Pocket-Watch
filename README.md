# Mon-Pocket-Watch

A limited-edition digital collectible forged for true Monad pioneers. This pocket watch doesn’t just tell time — it marks your place in Monad history. With its intricate design and on-chain soul, it’s more than an NFT — it’s proof you were here first, keeping perfect time in a decentralized world.

# Mon Pocket Watch — Claim UI

Deploy instructions:
1. Add repo to GitHub and connect to Vercel.
2. Set environment variables in Vercel (see `.env.example`).
3. Ensure `public/Mon_Watch_SBT.mp4` is uploaded.
4. Deploy — open `/` to test.

Workflow:
- Users verify their X follow & 5000+ txs.
- Eligible users click "Claim Now" — they get registered (appends to `allowed_users.csv` in your GitHub).
- After registration ends (11 days), download CSV via `/api/get-allowed-csv` and upload it to Magic Eden for minting.

Mint price: **2.19 MON** — a nod to Feb 19 (Monad Testnet launch).
