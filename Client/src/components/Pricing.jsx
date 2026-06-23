import React from 'react'

const prizes = [
  { label: '1st Prize', value: '₹25 Crore', winners: '1 Person' },
  { label: '2nd Prize', value: '₹10 Crore', winners: '1 Person' },
  { label: '3rd Prize', value: '₹75 Lakh', winners: '1 Person' },
  { label: '4th Prize', value: '₹25 Lakh', winners: '12 Person' },
  { label: '5th Prize', value: '₹12 Lakh', winners: '16 Person' },
  { label: '6th Prize', value: '₹5 Lakh', winners: '36 Person' },
  { label: '7th Prize', value: '₹7,500', winners: '99 Person' },
  { label: '8th Prize', value: '₹2,500', winners: '120 Person' },
  { label: '9th Prize', value: '₹1,000', winners: '179 Person' },
  { label: '10th Prize', value: '₹500', winners: '200 Person' },
]

export function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8e2] via-[#ffefc2] to-[#f3d284] text-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-[2.5rem] border border-red-500/10 bg-white shadow-[0_45px_100px_rgba(251,146,60,0.18)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#f3d053] via-[#f9b33b] to-[#ef6b2f] px-4 py-8 sm:px-10 sm:py-14 text-slate-950">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-950/80">Mega Bumper DHAMAKA OFFER</p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.04em]">Mega Kerala Lottery</h1>
            <p className="mt-3 text-base sm:text-lg text-slate-950/90 max-w-3xl leading-relaxed">
              Dear Kerala.Lottery Customer, Golden chance to win ₹25 CRORE. Booking available now for Festival Dhamaka Offer Tickets.
            </p>
          </div>

          <div className="px-2 py-2 sm:px-10 sm:py-10 space-y-10">
            <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1.15fr_0.85fr] text-black">
              <div className="rounded-[2rem] border border-red-500/10 bg-gradient-to-r from-[#f3d053] via-[#f9b33b] to-[#ef6b2f] p-3 sm:p-4 shadow-xl text-black">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs text-black uppercase tracking-[0.3em] text-red-100 font-semibold mb-6">
                  Festival Dhamaka Offer Tickets
                </div>
                <h2 className="text-3xl font-extrabold uppercase tracking-[-0.03em]">Book Ticket&apos;s NOW!</h2>
                <p className="mt-4 text-sm leading-7 text-black">
                  Booking available for the Mega Kerala Lottery. Play smart and join daily draws for massive prizes.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-slate-700 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">1 Ticket</p>
                    <p className="mt-3 text-3xl font-black">₹149/-</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-700 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">3 Tickets</p>
                    <p className="mt-3 text-2xl font-black">₹399/-</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-700 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">5 Tickets</p>
                    <p className="mt-3 text-2xl font-black">₹596/-</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-6 sm:p-8 shadow-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-700">Booking charge</p>
                <p className="mt-4 text-3xl sm:text-4xl font-black text-slate-950">₹399/-</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">for 3 Tickets</p>
                <div className="mt-6 sm:mt-8 rounded-[1.75rem] p-4 sm:p-5 border border-white/10 text-white">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ticket pricing only</p>
                  <p className="mt-3 text-2xl font-black">No draw details shown</p>
                  <p className="mt-2 text-sm text-slate-500">Purchase details only.</p>
                </div>
              </div>
            </div>

            <section className="rounded-[2rem] border border-red-500/10 bg-gradient-to-r from-[#f3d053] via-[#f9b33b] to-[#ef6b2f]  p-4 shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-red-700">Prize Breakdown</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-slate-950">Mega Kerala Lottery Prizes</h3>
                </div>
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-950">
                  10 major prizes + consolation rewards
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {prizes.map((item) => (
                  <div key={item.label} className="rounded-[1.75rem] border border-slate-200 p-4 shadow-inner text-white">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-sm text-white">{item.winners}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-red-500/25 bg-red-100 p-6 text-slate-950">
                <p className="font-semibold">Consolation Priz@s for 665 lucky winners.</p>
              </div>
            </section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
                <h4 className="text-lg font-bold">Mega Kerala Lottery</h4>
                <p className="mt-2 text-sm text-slate-700">Grab your ticket before the draw closes and claim your chance at the bumper jackpot.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
