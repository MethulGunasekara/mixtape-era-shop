'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleCart, getTotalItems } = useCart()
  const cartCount = getTotalItems()

  const navLinks = [
    { name: 'PACKS', href: '#shop' },
    { name: 'SINGLES', href: '#singles' },
    { name: 'ABOUT', href: '#about' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream border-b-4 border-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-3 group">
              <img 
                src="/mixtapeEraLogo.png" 
                alt="Mixtape Era" 
                className="h-12 w-auto object-contain transition-transform group-hover:rotate-12" 
              />
              <span className="font-display text-xl md:text-2xl font-black tracking-tighter block text-brand-black uppercase">
                MIXTAPE ERA
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="font-mono text-sm font-black uppercase hover:text-brand-red transition-colors tracking-widest"
              >
                {link.name}
              </a>
            ))}
            
            <button 
              onClick={toggleCart}
              className="px-6 py-2 border-4 border-brand-black shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-mono text-sm bg-brand-red text-white font-black uppercase tracking-widest"
            >
              CART [{cartCount}]
            </button>
          </div>

          {/* Mobile Menu Button + Cart Icon */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={toggleCart}
              className="text-xs font-black font-mono bg-brand-red text-white px-3 py-2 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] active:shadow-none active:translate-y-[2px] transition-all"
            >
              CART [{cartCount}]
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border-2 border-brand-black bg-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t-4 border-brand-black py-6 space-y-6 bg-brand-cream animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="block font-mono text-lg font-black uppercase px-4 hover:bg-brand-yellow py-2 transition-colors" 
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}