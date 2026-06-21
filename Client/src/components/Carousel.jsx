import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Carousel({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((p) => (p + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => setCurrentIndex(index)
  const nextSlide = () => setCurrentIndex((p) => (p + 1) % slides.length)
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + slides.length) % slides.length)

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div className="relative h-80 bg-gray-100">
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition z-10" aria-label="Previous slide">
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition z-10" aria-label="Next slide">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition ${index === currentIndex ? 'bg-orange w-6' : 'bg-white/50 hover:bg-white'}`} aria-label={`Go to slide ${index + 1}`} role="tab" />
        ))}
      </div>
    </div>
  )
}
