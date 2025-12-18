'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Variant {
  name: string;
  price: string;
  image_url: string;
}

interface ProductProps {
  id: number;
  title: string;
  price: string;       // Default / Lowest price
  image: string;       // Default / First image
  badge_text?: string | null;
  badge_type?: string | null;
  variants?: Variant[]; // <--- New Prop
}

export default function ProductCard({ id, title, price, image, badge_text, badge_type, variants }: ProductProps) {
  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  // State for interactivity
  const [currentImage, setCurrentImage] = useState(image);
  const [currentPrice, setCurrentPrice] = useState(price);
  const [selectedVariantName, setSelectedVariantName] = useState<string | null>(null);

  // If variants exist, default to the first one (which should be lowest price based on dashboard logic)
  useEffect(() => {
    if (variants && variants.length > 0) {
      setCurrentImage(variants[0].image_url);
      setCurrentPrice(variants[0].price);
      setSelectedVariantName(variants[0].name);
    }
  }, [variants]);

  const handleVariantClick = (e: React.MouseEvent, variant: Variant) => {
    e.preventDefault(); // Stop Link navigation
    e.stopPropagation();
    setCurrentImage(variant.image_url);
    setCurrentPrice(variant.price);
    setSelectedVariantName(variant.name);
  };

  // --- BADGE DRAWING (Keep existing logic) ---
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

  // --- PRICE LOGIC ---
  const calculateDisplayPrice = () => {
    const priceValue = parseFloat(currentPrice.replace(/[^0-9.]/g, '')) || 0;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      title,
      price: finalPrice, // Use the specific price of the selected variant
      image_url: currentImage, // Use specific image
      variant: selectedVariantName || 'Standard' // Pass the variant name
    });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1000);
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div className="group bg-white border-4 border-brand-black p-4 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] transition-all cursor-pointer relative flex flex-col h-full">
        
        {/* Badge Logic (Hidden for brevity, same as before) */}
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
        
        {/* IMAGE */}
        <div className="h-64 bg-gray-200 border-2 border-brand-black mb-4 flex items-center justify-center relative overflow-hidden shrink-0">
          {currentImage ? (
            <img src={currentImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-gray-400 font-mono">NO IMG</span>
          )}
        </div>

        {/* VARIANT BUTTONS (The New Feature) */}
        {variants && variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {variants.map((v, i) => (
              <button
                key={i}
                onClick={(e) => handleVariantClick(e, v)}
                className={`text-xs font-bold px-2 py-1 border-2 border-brand-black uppercase transition-all ${
                  selectedVariantName === v.name 
                    ? 'bg-brand-black text-white' 
                    : 'bg-white text-brand-black hover:bg-gray-100'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        
        {/* TITLE & PRICE */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold uppercase leading-none mb-1">{title}</h3>
            <p className="text-brand-red font-mono font-bold text-lg">{finalPrice}</p>
          </div>
          <button 
            className={`w-10 h-10 border-2 border-brand-black flex items-center justify-center text-xl font-bold transition-all ${
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