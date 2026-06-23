import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { lotteryUtils } from '@/lib/lotteryUtils'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function Winner() {
  const search = useQuery()
  const [winner, setWinner] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadWinner() {
      const phone = search.get('phone')
      if (!phone) { setNotFound(true); return }

      try {
        const normalized = lotteryUtils.normalizePhone(phone)
        const response = await fetch(`/api/winners/lookup?phone=${encodeURIComponent(normalized)}`)
        if (!response.ok) {
          setNotFound(true)
          return
        }
        const data = await response.json()
        setWinner(data.winner)
      } catch (error) {
        console.error(error)
        setNotFound(true)
      }
    }

    loadWinner()
  }, [search])

  if (notFound) return (
    <div className="min-h-screen bg-[#f8f0c1] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_35px_80px_rgba(0,0,0,0.08)] p-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Result Not Found</h1>
        <p className="text-slate-600 mb-8">We couldn't find a winner for this number. Please try again with the correct phone number.</p>
        <Link to="/" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition">Back to Search</Link>
      </div>
    </div>
  )

  if (!winner) return (
    <div className="min-h-screen bg-[#071b38] flex items-center justify-center px-4 py-16 text-white">
      <p className="text-slate-300">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen  text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_35%)] pointer-events-none" />
      <div className="relative mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden">
          <div className="relative overflow-hidden">
            <img src="/images/winner logo.jpeg" alt="Lottery banner" className="w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/50" />
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">LIVE RESULT</p>
              <p className="mt-2 text-sm text-slate-200">{new Date().toLocaleDateString('en-GB')}</p>
              <h1 className="mt-5 text-3xl font-extrabold uppercase tracking-[0.18em] text-emerald-300 sm:text-4xl">CONGRATULATIONS! 🎉</h1>
              <p className="mt-2 text-sm text-slate-200">Your lottery result is here. Check your winning ticket details below.</p>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10  p-4 shadow-lg">
              <div className="rounded-[1.75rem] bg-gradient-to-r from-[#f5d96b] via-[#ffe98a] to-[#f5d96b] p-5 text-center shadow-inner">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Name</p>
                <p className="mt-2 text-2xl font-bold text-white">{winner.name}</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] bg-slate-900/80 p-4 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Mobile</p>
                  <p className="mt-2 text-lg font-semibold text-white">{winner.phone}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-4 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Ticket</p>
                  <p className="mt-2 text-lg font-semibold text-white">{winner.ticketNumber || 'N/A'}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-4 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Position</p>
                  <p className="mt-2 text-lg font-semibold text-white">{winner.position || '5Th'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-500 p-6 text-center shadow-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-white/90">Your Winning</p>
              <p className="mt-3 text-4xl font-black text-white">₹ 12,00,000/-</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/80">If prize above ₹5 Lakh, Govt. Tax Applicable.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95">
                Check Prize Status
              </button>
              <a
                href="https://api.whatsapp.com/send/?phone=%2B918981866012&text=Hello%20I%20am%20a%20lottery%20winner&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-95"
              >
                WhatsApp Support
              </a>
            </div>

            <div className="mt-10 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-lg">
                <div className="rounded-[1.75rem] bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em]">1st Prize ₹10,00,00,000</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">KL 050049</span>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-lg">
                <div className="rounded-[1.75rem] bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em]">2nd Prize ₹1,00,00,000</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {['KL 01025', 'KL 02584', 'KL 12458', 'KL 15450'].map((code) => (
                    <span key={code} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">{code}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-lg">
                <div className="rounded-[1.75rem] bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em]">3rd Prize ₹12,00,000</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {['KL468568', 'KL 657832', 'KL 895848', 'KL 078649', 'KL 000401', 'KL 145247'].map((code) => (
                    <span key={code} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">{code}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-lg">
                <div className="rounded-[1.75rem] bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em]">4th Prize ₹8,00,000</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {['KL 002665', 'KL 898226', 'KL 068550', 'KL 092438', 'KL 012587', 'KL 987522', 'KL 145896', 'KL 128796'].map((code) => (
                    <span key={code} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">{code}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-lg">
                <div className="rounded-[1.75rem] bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em]">5th Prize ₹50,000</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {['KL 458785', 'KL 021856', 'KL 125478', 'KL 254587', 'KL 021548', 'KL 128564', 'KL 125876', 'KL 203654', 'KL 333855', 'KL 154788'].map((code) => (
                    <span key={code} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">{code}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
