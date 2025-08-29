import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Monad Pocket Watch — Claim</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Register to mint the limited Monad Pocket Watch — follow @monad & @monadicons and 5000+ txs on Monad." />
        <meta property="og:title" content="Monad Pocket Watch — Claim" />
        <meta property="og:description" content="Register to mint the limited Monad Pocket Watch." />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
