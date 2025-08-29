// app/layout.js — minimal layout required by Next app router
export const metadata = {
  title: 'Monad Pocket Watch',
  description: 'Claim the Monad Pocket Watch',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
