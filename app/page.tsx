'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar /> 
      
      {/* --- HERO SCENE START --- */}
      <section className="relative w-full h-[600px] bg-brand-cream border-b-4 border-brand-black overflow-hidden flex items-center justify-center">
        
        {/* The Central "Poster" Container */}
        <div className="relative z-20 scale-90 md:scale-100">
          
          {/* 1. Floating Cassette (FIXED POSITIONS) */}
          {/* Mobile: -top-16 (visible) | Desktop: -top-32 (far out) */}
          <img 
            src="/cassette.png" 
            alt="Tape"
            className="absolute -top-16 -left-6 w-32 md:-top-32 md:-left-28 md:w-56 -rotate-12 drop-shadow-xl z-30 animate-float-slow"
          />

          {/* 2. Floating Boombox (FIXED POSITIONS) */}
          {/* Mobile: -bottom-20 (visible) | Desktop: -bottom-36 (far out) */}
          <img 
            src="/boombox.png" 
            alt="Boombox"
            className="absolute -bottom-20 -right-6 w-40 md:-bottom-36 md:-right-40 md:w-72 rotate-6 drop-shadow-xl z-30 animate-float-delayed"
          />

          {/* The Text Box */}
          <div className="bg-brand-red border-4 border-brand-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] text-center transform hover:scale-105 transition-transform duration-300 relative z-20">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-brand-black leading-[0.9]">
              STICK TO<br/>THE VIBE
            </h1>
            <p className="mt-4 font-bold text-sm md:text-xl tracking-widest">/// EST. 2025 ///</p>
          </div>
        </div>

        {/* 4. Yellow Marquee Strip (Seamless Loop) */}
        <div className="absolute bottom-0 left-0 right-0 bg-brand-yellow border-t-4 border-brand-black py-3 overflow-hidden z-10 flex">
           <div className="animate-marquee whitespace-nowrap flex-shrink-0 flex gap-4 px-4">
             <span className="text-2xl font-black">LIMITED DROPS • PREMIUM VINYL • OLD SCHOOL VIBES • ISLANDWIDE DELIVERY • CASH ON DELIVERY • </span>
             <span className="text-2xl font-black">LIMITED DROPS • PREMIUM VINYL • OLD SCHOOL VIBES • ISLANDWIDE DELIVERY • CASH ON DELIVERY • </span>
           </div>
           <div className="animate-marquee whitespace-nowrap flex-shrink-0 flex gap-4 px-4">
             <span className="text-2xl font-black">LIMITED DROPS • PREMIUM VINYL • OLD SCHOOL VIBES • ISLANDWIDE DELIVERY • CASH ON DELIVERY • </span>
             <span className="text-2xl font-black">LIMITED DROPS • PREMIUM VINYL • OLD SCHOOL VIBES • ISLANDWIDE DELIVERY • CASH ON DELIVERY • </span>
           </div>
        </div>

      </section>
      {/* --- HERO SCENE END --- */}

      {/* Shop Grid */}
      <section id="shop" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-20">
        <h2 className="text-4xl font-black mb-12 uppercase border-l-8 border-brand-red pl-4">Featured Drops</h2>
        
        {products.length === 0 && (
          <p className="text-xl opacity-50">Loading drops from database...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} image={product.image_url} />
          ))}
        </div>
      </section>
    </main>
  );
}