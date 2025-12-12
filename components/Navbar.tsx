'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleCart, getTotalItems } = useCart()
  const cartCount = getTotalItems()

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream border-b-2 border-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-3 group">
              {/* Logo Image */}
              <img 
                src="/mixtapeEraLogo.png" 
                alt="Mixtape Era" 
                className="h-10 w-auto object-contain" 
              />
              
              {/* FIXED: Removed 'hidden' so this text shows on Mobile too */}
              <span className="font-display text-xl md:text-2xl font-bold tracking-tight block text-brand-black">
                MIXTAPE ERA
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#shop" className="font-mono text-sm hover:underline font-bold">
              SHOP
            </a>
            <a href="#about" className="font-mono text-sm hover:underline font-bold">
              ABOUT
            </a>
            
            <button 
              onClick={toggleCart}
              className="px-4 py-2 border-2 border-brand-black rounded-md shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] transition-all font-mono text-sm bg-brand-red text-white font-bold"
            >
              CART ({cartCount})
            </button>
          </div>

          {/* Mobile Menu Button + Cart Icon */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Button */}
            <button 
              onClick={toggleCart}
              className="text-sm font-bold font-mono bg-brand-red text-white px-3 py-1 border-2 border-brand-black rounded"
            >
              CART ({cartCount})
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border-2 border-brand-black rounded-md hover:shadow-button transition-shadow bg-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-brand-black py-4 space-y-4 bg-brand-cream">
            <a href="#shop" className="block font-mono text-sm hover:underline px-2 font-bold" onClick={() => setIsMenuOpen(false)}>
              SHOP
            </a>
            <a href="#about" className="block font-mono text-sm hover:underline px-2 font-bold" onClick={() => setIsMenuOpen(false)}>
              ABOUT
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}