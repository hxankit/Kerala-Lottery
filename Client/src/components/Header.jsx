import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X,Lock } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  // { href: '/winners', label: 'Winners', key: 'winners' },
  { href: '/help', label: 'Help Center', key: 'help' },
  { href: '/contact', label: 'Contact Us', key: 'contact' },
  { href: '/admin', label: '', key: 'admin' },
]

const tickerMessages = [
  '1 Ticket for 149/- Only',
  '2 Ticket for 399/- Only',
  '5 Ticket for 596/- Only',
  "Consolation Priz@s for 665 lucky winners"
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => setIsOpen(!isOpen)

  return (
    <>
      <style>{`
        @keyframes ticker-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-rtl 25s linear infinite;
        }
        .ticker-wrap:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-wrap relative bg-gradient-to-r from-[#f5d96b] via-[#ffe98a] to-[#f5d96b] text-ink overflow-hidden whitespace-nowrap flex items-center text-sm font-bold shadow-md border-b-2 border-yellow-600">
        <span className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 inline-flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider flex-shrink-0 shadow-lg z-10 [clip-path:polygon(0_0,100%_0,92%_100%,0%_100%)]">
          <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Live Result
        </span>

        <div className="flex w-max">
          <div className="ticker-track flex gap-10 py-2.5 px-4">
            {tickerMessages.concat(tickerMessages).map((msg, i) => (
              <span key={i} className="flex-shrink-0 inline-flex items-center gap-2 drop-shadow-sm">
                <span className="text-red-600 text-lg leading-none">★</span>
                {msg}
              </span>
            ))}
          </div>
          <div className="ticker-track flex gap-10 py-2.5 px-4" aria-hidden="true">
            {tickerMessages.concat(tickerMessages).map((msg, i) => (
              <span key={`dup-${i}`} className="flex-shrink-0 inline-flex items-center gap-2 drop-shadow-sm">
                <span className="text-red-600 text-lg leading-none">★</span>
                {msg}
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#f5d96b] to-transparent"></div>
      </div>

      <header className="bg-gradient-to-r from-[#f5d96b] via-[#ffe98a] to-[#f5d96b] border-b-4 border-orange sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img
              src="/images/logoWinner.png"
              alt="Kerala Lottery logo"
              className="w-12 h-12 rounded-full border-2 border-white shadow"
            />
            <div className="hidden sm:block">
              <div className="font-extrabold text-ink text-base leading-tight">Sthree Sakthi Kerala Lottery</div>
              <div className="text-xs text-red-700 uppercase tracking-wider font-semibold">Government of Kerala · Live Results</div>
            </div>
          </Link>

          <button
            onClick={toggleDrawer}
            className="lg:hidden p-2 bg-white/40 hover:bg-white/70 rounded-md transition shadow-sm"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6 text-ink" /> : <Menu className="w-6 h-6 text-ink" />}
          </button>

          <nav className="hidden lg:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className="px-4 py-2 rounded-md text-ink hover:bg-white/50 hover:shadow-sm transition text-sm font-semibold flex items-center gap-1.5"
              >
                {item.key === 'admin' && <Lock className="w-3.5 h-3.5" />}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setIsOpen(false)} />
            <aside className="fixed left-0 top-0 h-full w-full sm:max-w-xs bg-gradient-to-b from-[#f5d96b] to-[#ffe98a] shadow-2xl lg:hidden z-40 pt-16 border-r-4 border-orange overflow-y-auto">

              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="block px-4 py-3 rounded-md text-ink font-semibold bg-white/30 hover:bg-white/60 transition shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-orange/50 p-4 text-xs text-red-700 font-medium">
                Sthree Sakthi Kerala Lottries<br />Established 2017
              </div>
            </aside>
          </>
        )}
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-cream border-t-4 border-orange mt-12 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Kerala Lottery</h3>
            <p className="text-sm text-cream/70">Reliable. Transparent. Popular. Official live results from the Sthree Sakthi Kerala.</p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Office Address</h3>
            <address className="text-sm not-italic text-cream/70 leading-relaxed">
              3rd Floor KSRTC Building,<br />
              Thampanoor,<br />
              Thiruvananthapuram.<br />
              695001
            </address>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-cream/70 flex flex-col">
              <Link to={"/"} className="hover:text-orange transition cursor-pointer">Home</Link>
              <Link to={"/pricing"} className="hover:text-orange transition cursor-pointer">Pricing</Link>
              <Link to={"/help"} className="hover:text-orange transition cursor-pointer">Help Center</Link>
              <Link to={"/contact"} className="hover:text-orange transition cursor-pointer">Contact Us</Link>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-6 text-center">
          <p className="text-xs text-cream/60">&copy; All rights reserved 2024,  Sthree Sakthi Lottery.</p>
        </div>
      </div>
    </footer>
  )
}