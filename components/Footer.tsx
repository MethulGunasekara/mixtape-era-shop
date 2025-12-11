'use client'

import { MessageCircle, Instagram, Music2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="about" className="bg-black text-white border-t-4 border-brand-yellow font-mono overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* LEFT SIDE: Info & Socials */}
        <div className="flex flex-col gap-6 text-center md:text-left w-full md:w-1/2 z-10">
          <div>
            <h3 className="text-brand-yellow font-black text-xl uppercase mb-2">ABOUT US</h3>
            <p className="text-gray-300 max-w-sm leading-relaxed mx-auto md:mx-0 text-sm">
              Reliving the golden era of analog vibes. Stick to the vibe.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="https://wa.me/94721717874" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-brand-green transition-colors group justify-center md:justify-start"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span>+94 72 171 7874</span>
            </a>
            
            <a 
              href="https://www.instagram.com/mixtapeeraofficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-[#E4405F] transition-colors group justify-center md:justify-start"
            >
              <Instagram className="w-5 h-5 text-[#E4405F] group-hover:scale-110 transition-transform" />
              <span>@mixtapeeraofficial</span>
            </a>

            <a 
              href="https://www.tiktok.com/@mixtapeeraofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-[#00F2EA] transition-colors group justify-center md:justify-start"
            >
              <Music2 className="w-5 h-5 text-[#00F2EA] group-hover:scale-110 transition-transform" />
              <span>@mixtapeeraofficial</span>
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: The Neon Brand with MATCHING GLOW */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-6 md:mt-0">
          
          {/* GLOW 1: ORANGE/RED (Top - Behind the Cassette) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-600/40 blur-[70px] rounded-full pointer-events-none"></div>
          
          {/* GLOW 2: CYAN/BLUE (Bottom - Behind the Text) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-24 bg-cyan-500/40 blur-[60px] rounded-full pointer-events-none"></div>
          
          {/* THE IMAGE */}
          <img 
            src="/neon-logo.png" 
            alt="Mixtape Era Neon" 
            className="relative z-10 w-full max-w-md object-contain"
          />
        </div>

      </div>
      
      {/* Copyright Strip */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500 relative z-10">
        © 2025 MIXTAPE ERA. ALL RIGHTS RESERVED.
      </div>
    </footer>
  )
}