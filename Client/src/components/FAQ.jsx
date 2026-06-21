import React, { useState } from 'react'

const items = [
  { q: 'How do I check if I won?', a: 'On the home page, enter your registered 10-digit phone number in the "Check Your Result" box and press Search. If you are a winner, your winner details page will open automatically.' },
  { q: 'When are the draws held?', a: 'The Sthree Sakthi lottery draw is held every Tuesday at 3:00 PM. Results are published live on this site right after the draw.' },
  { q: 'How do I claim my prize?', a: 'Winners should surrender the winning ticket along with valid ID proof at the Directorate of Kerala State Lotteries within 30 days of the draw. Use the Contact page to reach our support team.' },
  { q: 'Is this the official website?', a: 'Results shown here are for reference only. Always verify your result with the official Kerala State Lotteries gazette before claiming any prize.' },
  { q: 'I lost my ticket. What should I do?', a: 'The physical ticket is mandatory to claim a prize. Unfortunately a lost or damaged ticket cannot be used for claiming. Keep your ticket safe until the prize is claimed.' },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center shadow-md mx-auto mb-4">
          <span className="text-white text-2xl">❓</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Everything you need to know about checking and claiming results.</p>
      </div>

      <div className="space-y-3">
        {items.map((it, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className={`bg-[#fffaf0] rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-amber-500 shadow-md' : 'border-amber-200 shadow-sm'
              }`}
            >
              <button
                className="w-full text-left flex items-center justify-between gap-4 px-5 py-4"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-gray-900">{it.q}</span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 border-t border-amber-200 pt-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{it.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}