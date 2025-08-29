// app/page.js — tiny entry page so Next finds an app/ directory
export default function Page() {
  return (
    <main style={{minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#05050a', color:'#fff'}}>
      <div style={{textAlign:'center', padding: 24}}>
        <h1 style={{fontSize:28, marginBottom:8}}>Monad Pocket Watch</h1>
        <p style={{color:'#bfc9d9'}}>App entry created to satisfy Next build. Your full pages/ app content will remain unchanged.</p>
      </div>
    </main>
  )
}
