import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CalendarDays, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { Carousel } from './Carousel'
import { lotteryUtils } from '@/lib/lotteryUtils'

export function Home() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState('')
    const [error, setError] = useState(false)

    const slides = [
        { src: '/images/slide1.png', alt: 'Kerala State Lotteries live draw event' },
        { src: '/images/slide2.png', alt: 'Kerala lottery tickets' },
        { src: '/images/slide3.png', alt: 'Kerala lottery winner ceremony' },
    ]

    const handleSearch = async (e) => {
        e.preventDefault()
        const normalized = lotteryUtils.normalizePhone(phone)
        if (normalized.length < 7) { setError(true); return }

        try {
            const response = await fetch(`/api/winners/lookup?phone=${encodeURIComponent(normalized)}`)
            if (!response.ok) {
                setError(true)
                return
            }
            navigate(`/winner?phone=${encodeURIComponent(normalized)}`)
        } catch (error) {
            console.error(error)
            setError(true)
        }
    }

    return (
        <>
            <section className="mb-8 relative overflow-hidden shadow-lg">
                <div
                    className="absolute inset-0 bg-center bg-cover scale-110 blur-xl opacity-50"
                    style={{ backgroundImage: 'url(/images/banner.png)' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <img
                    src="/images/banner.png"
                    alt="Kerala Lottery banner"
                    className="relative w-full h-44 sm:h-56 md:h-72 lg:h-80 object-contain mx-auto"
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">Live Draw Results Updated Daily</span>
                </div>
            </section>

            <section className="mb-12 px-4">
                <div className="max-w-2xl mx-auto relative">
                    <div className="absolute -top-3 -left-3 w-20 h-20 bg-yellow-300/40 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-amber-400/30 rounded-full blur-2xl"></div>

                    <div className="relative bg-[#fffaf0] rounded-2xl p-5 sm:p-10 shadow-xl border-2 border-amber-400/40">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md flex-shrink-0">
                                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Check Your Result</h2>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-5 ml-[52px] sm:ml-[60px]">Enter your registered phone number to find out if you are a winner.</p>

                        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5" autoComplete="off">
                            <div>
                                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-xs sm:text-sm">+91</span>
                                    <input
                                        id="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, '')
                                            setPhone(digitsOnly)
                                            setError(false)
                                        }}
                                        placeholder="Enter 10-digit phone number"
                                        className="w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3.5 border-2 border-amber-600 rounded-lg bg-white text-sm sm:text-base font-medium tracking-wide text-gray-900 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/30 transition"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div role="alert" aria-live="polite" className="flex items-center gap-2 bg-red-50 border border-red-500 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
                                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                                    No winner found. Please check the number and try again.
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-[0.98] text-white text-sm sm:text-base font-bold py-2.5 sm:py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                            >
                                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                Search Result
                            </button>
                        </form>

                        <p className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray-500 text-center mt-4 sm:mt-6">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            Your information is kept private and secure.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Kerala State Lotteries Gallery</h2>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200">
                        <Carousel slides={slides} />
                    </div>
                </div>
            </section>

            <section className="mb-12 px-4 space-y-4">
                <div className="max-w-6xl mx-auto bg-amber-50 border-l-4 border-amber-500 px-6 py-4 rounded-lg shadow-sm flex gap-3 items-start">
                    <span className="text-amber-600 text-lg leading-none mt-0.5">ℹ️</span>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">Note:</span> Kerala State Lotteries is a lottery programme run by the Government of Kerala. Established in 1967, under the lottery department of the Government of Kerala, it is the first of its kind in India.
                    </p>
                </div>
                <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 bg-green-50 border border-green-200 py-2.5 rounded-full shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                    </span>
                    <p className="text-center font-semibold text-green-700 text-sm sm:text-base">Kerala Lottery Live Result Is Available Now.</p>
                </div>
            </section>

            <section className="mb-12 px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-white rounded-2xl p-5 sm:p-8 shadow-xl border border-amber-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Sthree Sakthi Lottery Result</h2>
                        <span className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            Live
                        </span>
                    </div>
                    <p className="text-gray-600 mb-6 flex items-center gap-2 text-sm sm:text-base">
                        <CalendarDays className="w-4 h-4 text-amber-600" />
                        Draw held every Tuesday at 3:00 PM
                    </p>

                    <div className="space-y-3">
                        <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white p-4 sm:p-5 rounded-xl flex flex-wrap justify-between items-center gap-2 font-bold shadow-lg relative overflow-hidden border border-green-500/40">
                            <span className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></span>
                            <span className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full"></span>
                            <span className="flex items-center gap-2 relative z-10 text-sm sm:text-base">
                                <Trophy className="w-5 h-5 text-yellow-300" />
                                1st Prize ₹ 1,00,00,000/-
                            </span>
                            <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm tracking-wider relative z-10">SS 123456</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl flex flex-wrap justify-between items-center gap-2 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">Consolation Prize ₹ 8,000/-</span>
                            <span className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">SN SO SP SR SS ST SU SV SW SX</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl flex flex-wrap justify-between items-center gap-2 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">2nd Prize ₹ 10,00,000/-</span>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold tracking-wider">SS 456789</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl flex flex-wrap justify-between items-center gap-2 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">3rd Prize ₹ 5,000/-</span>
                            <span className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">0123 0456 0789 1234 1567 1890</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-6 border-t border-amber-200 pt-4 flex items-center gap-1.5">
                        <span>⚠️</span>
                        Results are for reference only. Always verify with the official Kerala State Lotteries gazette.
                    </p>
                </div>
            </section>
        </>
    )
}
