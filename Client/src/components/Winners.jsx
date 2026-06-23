import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { lotteryUtils } from '@/lib/lotteryUtils'

export function Winners() {
  const [winners, setWinners] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadWinners() {
      try {
        const response = await fetch('/api/winners')
        if (!response.ok) return
        const data = await response.json()
        setWinners(data.winners || [])
      } catch (error) {
        console.error(error)
      }
    }

    setIsAdmin(lotteryUtils.isAdmin())
    loadWinners()
  }, [])

  const handleDelete = async (index) => {
    try {
      const response = await fetch(`/api/winners/${index}`, {
        method: 'DELETE',
      })
      if (!response.ok) return
      const data = await response.json()
      setWinners(data.winners || [])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Lottery Winner Details</h1>
        <p className="text-muted">Official Sthree Sakthi Kerala Lottery winners</p>
      </div>

      {winners.length === 0 ? (
        <div className="bg-cream rounded-lg p-12 text-center">
          <p className="text-muted mb-6">No winners added yet.</p>
          <Link to="/admin" className="inline-block bg-orange hover:bg-orange/90 text-white font-bold py-2 px-6 rounded transition">Go to Admin Portal</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream border-b-2 border-orange">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-ink">#</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Winner Name</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Ticket Number</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Position</th>
                {isAdmin && <th className="px-6 py-4 text-center font-bold text-ink">Action</th>}
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr key={index} className="border-b hover:bg-cream-soft transition">
                  <td className="px-6 py-4 font-semibold">{index + 1}</td>
                  <td className="px-6 py-4">{winner.name}</td>
                  <td className="px-6 py-4 font-mono">{winner.ticketNumber || '—'}</td>
                  <td className="px-6 py-4">{winner.position || '—'}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(index)} className="text-red hover:text-red/80 transition inline-flex items-center gap-1" aria-label="Delete winner">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
