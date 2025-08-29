import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Monad Pocket Watch — Claim</title>
        <meta name="description" content="Claim the limited Monad Pocket Watch — check eligibility, register and mint." />
        <meta property="og:title" content="Monad Pocket Watch — Claim" />
        <meta property="og:description" content="Limited edition — check eligibility, register, and mint the Monad Pocket Watch." />
        <meta property="og:image" content="/Mon_Watch_SBT.mp4" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
