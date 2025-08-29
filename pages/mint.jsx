import { useEffect, useState } from 'react'

export default function Mint(){
  const [open,setOpen] = useState(false)
  useEffect(()=>{
    // Mirror the same 11-day window rule used on index.
    const deadline = new Date(new Date().getTime() + 11*24*60*60*1000)
    setOpen(new Date() > deadline ? true : false)
  },[])
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center bg-neutral-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Mint</h1>
        {open ? (
          <>
            <p className="mb-4">Mint is open now. The allowlist is required and will be verified on Magic Eden.</p>
            <p className="mb-4">Mint price: <b>2.19 MON</b></p>
            <a className="btn bg-indigo-600 text-white" href="https://magiceden.io">Go to Magic Eden</a>
          </>
        ) : (
          <>
            <p className="mb-4">Mint not open yet. Registration must close first. Please check back when registration ends.</p>
            <a href="/" className="btn border">Back</a>
          </>
        )}
      </div>
    </div>
  )
}
