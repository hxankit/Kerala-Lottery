import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export function TicketGenerator() {
  const [ticketNumber, setTicketNumber] = useState('')
  const [drawTime, setDrawTime] = useState('06 PM')
  const [imgLoaded, setImgLoaded] = useState(false)
  const ticketRef = useRef(null)

  const times = ['06 AM', '06 PM', '12 PM', '03 PM', '04 PM', '05 PM']

  const handleGeneratePDF = async () => {
    if (!ticketNumber.trim()) {
      alert('Please enter a ticket number')
      return
    }
    if (!imgLoaded) {
      alert('Ticket image is still loading, please try again in a second')
      return
    }

    const element = ticketRef.current
    const img = element.querySelector('img')
    if (img && !img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 5

    const usableWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * usableWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, Math.min(imgHeight, pageHeight - margin * 2))
    pdf.save(`lottery-ticket-${ticketNumber}-${Date.now()}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ticket-num" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
            Ticket Number
          </label>
          <input
            id="ticket-num"
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
            placeholder="e.g. SS 123456"
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/20 transition"
          />
        </div>

        <div>
          <label htmlFor="draw-time" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
            Draw Time
          </label>
          <select
            id="draw-time"
            value={drawTime}
            onChange={(e) => setDrawTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/20 transition"
          >
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-amber-200 p-6 overflow-x-auto">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Preview</h3>
        <div ref={ticketRef} className="bg-white relative inline-block min-w-full">
          <img
            src="/images/rakhi.jpg"
            alt="Kerala Lottery Ticket Template"
            className="w-full h-auto"
            crossOrigin="anonymous"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute right-[8%] top-[44%] font-bold pointer-events-none">
            <div className="text-xs font-black drop-shadow-sm tracking-wider">
              {ticketNumber}
            </div>
          </div>

          <div className="absolute right-[42%] bottom-[22%] pointer-events-none">
            <div className="text-[9px] font-bold text-white drop-shadow-sm">
              {drawTime}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleGeneratePDF}
        disabled={!imgLoaded}
        className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3 rounded-lg shadow transition-all duration-150"
      >
        {imgLoaded ? '📄 Generate & Download PDF' : 'Loading ticket...'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        The PDF will include the ticket number and draw time overlaid on the lottery ticket image.
      </p>
    </div>
  )
}