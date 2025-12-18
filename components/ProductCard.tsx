'use client'

import React from 'react';
import Link from 'next/link';

interface ProductProps {
  id: number;
  title: string;
  price: string;       // This is the "Lowest Price" saved from dashboard
  image: string;       // This is the "Main Thumbnail"
  badge_text?: string | null;
  badge_type?: string | null;
}

export default function ProductCard({ id, title, price, image, badge_text, badge_type }: ProductProps) {

  // --- BADGE DRAWING (Standard) ---
  const generateStarPath = (points: number, outerRadius: number, innerRadius: number) => {
    let path = "";
    const centerX = 50; const centerY = 50;
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

  // Price Logic for Discount Badge
  const calculateDisplayPrice = () => {
    const priceValue = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    if (badge_type === 'discount' && badge_text) {
      const discountMatch = badge_text.match(/(\d+)/);
      const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
      if (discountPercent > 0) {
        return (priceValue - (priceValue * (discountPercent / 100))).toFixed(2);
      }
    }
    return priceValue.toFixed(2);
  };
  const finalPrice = calculateDisplayPrice();

  return (
    <Link href={`/product/${id}`} className="block h-full">
      <div className="group bg-white border-4 border-brand-black p-4 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] transition-all cursor-pointer relative flex flex-col h-full">
        
        {/* Badge Layer */}
        {badge_text && badge_type && badge_type !== 'none' && (
          <div className={`absolute z-10 -rotate-12 ${badge_type === 'offer' ? '-top-10 -left-10 w-32 h-32' : '-top-4 -left-4'}`}>
            {badge_type === 'discount' ? (
              <div className="relative border-2 border-brand-black font-black uppercase text-white bg-brand-red px-3 py-1 text-sm">
                {badge_text}% OFF
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#E4405F]" fill="currentColor"><path d={sunburstPath} stroke="#0F0F0F" strokeWidth="2" strokeLinejoin="round" /></svg>
                 <span className="relative z-10 text-white font-black uppercase text-sm">{badge_text}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Main Thumbnail */}
        <div className="h-64 bg-gray-200 border-2 border-brand-black mb-4 flex items-center justify-center relative overflow-hidden shrink-0">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-gray-400 font-mono">NO IMG</span>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-brand-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Simple Footer */}
        <div className="mt-auto">
          <h3 className="text-xl font-bold uppercase leading-none mb-2">{title}</h3>
          <p className="text-brand-red font-mono font-bold text-lg">
            Starts at {finalPrice}
          </p>
        </div>
      </div>
    </Link>
  );
}