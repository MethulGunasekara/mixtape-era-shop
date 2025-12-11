'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductProps {
  id: number;
  title: string;
  price: string;
  image?: string;
  badge_text?: string | null;
  badge_type?: string | null;
}

export default function ProductCard({ id, title, price, image, badge_text, badge_type }: ProductProps) {
  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  // --- HELPER: Generate Perfect Starburst Path ---
  const generateStarPath = (points: number, outerRadius: number, innerRadius: number) => {
    let path = "";
    const centerX = 50; 
    const centerY = 50;
    
    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / points;
      
      const x = centerX + r * Math.sin(angle);
      const y = centerY - r * Math.cos(angle);
      
      path += (i === 0 ? "M" : "L") + `${x.toFixed(2)},${y.toFixed(2)} `;
    }
    path += "Z";
    return path;
  };

  const sunburstPath = generateStarPath(16, 48, 38); 

  // --- PRICE CALCULATION ---
  const calculatePrice = (): string => {
    const priceValue = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    
    if (badge_type === 'discount' && badge_text) {
      const discountMatch = badge_text.match(/(\d+)/);
      const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
      
      if (discountPercent > 0) {
        const discountedPrice = priceValue - (priceValue * (discountPercent / 100));
        return discountedPrice.toFixed(2);
      }
    }
    return priceValue.toFixed(2);
  };

  const displayPrice = calculatePrice();
  const originalPriceDisplay = (parseFloat(price.replace(/[^0-9.]/g, '')) || 0).toFixed(2);
  const isDiscounted = badge_type === 'discount' && badge_text;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      title,
      price: displayPrice,
      image_url: image || '',
    });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1000);
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div className="group bg-white border-4 border-brand-black p-4 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] transition-all cursor-pointer relative">
        
        {/* Badge Sticker Logic */}
        {badge_text && badge_type && badge_type !== 'none' && (
          <div className={`absolute z-10 -rotate-12 ${
            badge_type === 'offer' ? '-top-10 -left-10 w-32 h-32' : '-top-4 -left-4'
          }`}>
            
            {/* --- CASE 1: DISCOUNT BADGE --- */}
            {badge_type === 'discount' && (
              <>
                <div 
                  className="absolute top-1 left-1 w-full h-full bg-red-800"
                  style={{ transform: 'rotate(2deg)' }}
                ></div>
                {/* REVERTED TO border-2 (Standard Thin Line) */}
                <div className="relative border-2 border-brand-black font-black uppercase text-white bg-brand-red px-3 py-1 text-sm">
                  {badge_text}% OFF
                </div>
              </>
            )}

            {/* --- CASE 2: SPECIAL OFFER BADGE --- */}
            {badge_type === 'offer' && (
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* LAYER 1: Hard Shadow (Dark Red) */}
                <svg 
                  viewBox="0 0 100 100" 
                  className="absolute inset-0 w-full h-full text-red-900 opacity-60"
                  fill="currentColor"
                  style={{ transform: 'translate(4px, 4px)' }} 
                >
                  <path d={sunburstPath} />
                </svg>

                {/* LAYER 2: Main Sticker with THINNER STROKE */}
                <svg 
                  viewBox="0 0 100 100" 
                  className="absolute inset-0 w-full h-full text-[#E4405F]"
                  fill="currentColor"
                >
                  <path 
                    d={sunburstPath} 
                    stroke="#0F0F0F" 
                    strokeWidth="2"  // Changed from 3 to 2
                    strokeLinejoin="round" 
                  />
                </svg>
                
                {/* Text Layer */}
                <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center w-full h-full">
                  <span className="text-white font-black uppercase text-sm leading-none whitespace-pre-line drop-shadow-sm transform rotate-0 break-words max-w-[80px]">
                    {badge_text}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Image */}
        <div className="h-64 bg-gray-200 border-2 border-brand-black mb-4 flex items-center justify-center relative overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-gray-400 font-mono">NO IMAGE</span>
          )}
          <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold uppercase leading-none mb-1">{title}</h3>
            {isDiscounted ? (
              <div className="flex flex-col">
                <p className="text-gray-400 font-mono text-sm line-through">{originalPriceDisplay}</p>
                <p className="text-brand-red font-mono font-bold text-lg">{displayPrice}</p>
              </div>
            ) : (
              <p className="text-brand-red font-mono font-bold">{displayPrice}</p>
            )}
          </div>
          <button 
            className={`w-10 h-10 border-2 border-brand-black flex items-center justify-center text-xl font-bold transition-all relative ${
              showAdded ? 'bg-brand-green text-white scale-110' : 'bg-brand-yellow hover:bg-brand-green hover:text-white'
            }`}
            onClick={handleAddToCart}
          >
            {showAdded ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  );
}