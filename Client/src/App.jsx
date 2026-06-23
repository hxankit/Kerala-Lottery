import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header, Footer } from '@/components/Header'
import { Home } from '@/components/Home'
import { Winners } from '@/components/Winners'
import { Winner } from '@/components/Winner'
import { Contact } from '@/components/Contact'
import { FAQ } from '@/components/FAQ'
import { Admin } from '@/components/Admin'
import { Pricing } from '@/components/Pricing'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Header />
      <main className="max-w-6xl mx-auto px-2 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* <Route path="/winners" element={<Winners />} /> */}
          <Route path="/winner" element={<Winner />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<FAQ />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
