import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { lotteryUtils } from '@/lib/lotteryUtils'

const INFO_CARDS = [
  {
    icon: MapPin,
    label: 'Office',
    value: '3rd Floor, KSRTC Building, Thampanoor, Thiruvananthapuram 695001',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '0471 – 2305230',
    sub: 'Mon – Sat, 10 AM – 5 PM',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@keralalotteries.gov.in',
  },
  {
    icon: Clock,
    label: 'Draw time',
    value: 'Every Tuesday',
    sub: '3:00 PM',
  },
]

export function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !message.trim()) return
    lotteryUtils.addMessage({ name: name.trim(), phone: phone.trim(), message: message.trim() })
    setSuccess(true)
    setName('')
    setPhone('')
    setMessage('')
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <p className="text-xs font-semibold tracking-widest uppercase text-orange mb-1">
        Kerala State Lotteries
      </p>
      <h1 className="text-3xl font-bold text-ink mb-1">Contact us</h1>
      <p className="text-muted mb-8">
        Reach our support team — we're here to help you Mon–Sat, 10 AM to 5 PM.
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {INFO_CARDS.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-white border border-line rounded-xl p-4 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-orange" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">{label}</p>
              <p className="text-sm text-ink leading-snug">{value}</p>
              {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Form card */}
      {/* <div className="bg-white border border-line rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Send className="w-5 h-5 text-orange" />
          <h2 className="text-lg font-bold text-ink">Send a message</h2>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green/10 border border-green/30 text-green rounded-lg px-4 py-3 text-sm mb-5">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Message sent — our team will get back to you shortly.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="block">
            <span className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-cream focus:outline-none focus:border-orange"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Phone number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-cream focus:outline-none focus:border-orange"
            />
          </label>
        </div>

        <label className="block mb-4">
          <span className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            rows={4}
            className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-cream focus:outline-none focus:border-orange resize-none"
          />
        </label>

        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-lg transition"
        >
          <Send className="w-4 h-4" />
          Send message
        </button>
      </div> */}
    </div>
  )
}