'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Packs
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      
      if (productData) setProducts(productData);

      // Fetch Individual Stickers
      const { data: stickerData } = await supabase
        .from('stickers')
        .select('*')
        .order('sticker_number', { ascending: true });

      if (stickerData) setStickers(stickerData);
    };
    fetchData();
  }, []);

  // Logic to group stickers by Pack Name
  const groupedStickers = stickers.reduce((acc, sticker: any) => {
    const pack = sticker.pack_name || 'Other Singles';
    if (!acc[pack]) acc[pack] = [];
    acc[pack].push(sticker);
    return acc;
  }, {} as Record<string, any[]>);

  // Filter groups based on search
  const filteredPackNames = Object.keys(groupedStickers).filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar /> 
      
      {/* --- HERO SCENE --- */}
      <section className="relative w-full h-[600px] bg-brand-cream border-b-4 border-brand-black overflow-hidden flex items-center justify-center">
        <div className="relative z-20 scale-90 md:scale-100">
          <img src="/cassette.png" alt="Tape" className="absolute -top-24 -left-20 w-44 md:-top-32 md:-left-28 md:w-56 -rotate-12 drop-shadow-xl z-30 animate-float-slow" />
          <img src="/boombox.png" alt="Boombox" className="absolute -bottom-28 -right-24 w-52 md:-bottom-36 md:-right-40 md:w-72 rotate-6 drop-shadow-xl z-30 animate-float-delayed" />
          <div className="bg-brand-red border-4 border-brand-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] text-center transform hover:scale-105 transition-transform duration-300 relative z-20">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-brand-black leading-[0.9]">STICK TO<br/>THE VIBE</h1>
            <p className="mt-4 font-bold text-sm md:text-xl tracking-widest">/// EST. 2025 ///</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-brand-yellow border-t-4 border-brand-black py-3 overflow-hidden z-10 flex">
           <div className="animate-marquee whitespace-nowrap flex-shrink-0 flex gap-4 px-4">
             <span className="text-2xl font-black">LIMITED DROPS • PREMIUM VINYL • OLD SCHOOL VIBES • ISLANDWIDE DELIVERY • CASH ON DELIVERY • </span>
           </div>
        </div>
      </section>

      {/* --- FEATURED PACKS SECTION --- */}
      <section id="shop" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-20">
        <h2 className="text-4xl font-black mb-12 uppercase border-l-8 border-brand-red pl-4">Featured Drops</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} image={product.image_url} />
          ))}
        </div>
      </section>

      {/* --- SINGLES SECTION --- */}
      <section id="singles" className="max-w-7xl mx-auto px-6 py-16 border-t-4 border-brand-black bg-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl font-black uppercase border-l-8 border-brand-yellow pl-4">Pick Your Singles</h2>
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="SEARCH VOLUMES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-4 border-brand-black font-bold uppercase focus:outline-none focus:bg-brand-yellow transition-colors shadow-[4px_4px_0px_0px_rgba(15,15,15,1)]"
            />
          </div>
        </div>

        {filteredPackNames.length === 0 ? (
          <p className="text-xl font-bold opacity-50">No packs found matching your search.</p>
        ) : (
          <div className="space-y-16">
            {filteredPackNames.map((packName) => (
              <div key={packName}>
                <h3 className="text-2xl font-black uppercase mb-6 inline-block bg-brand-black text-white px-4 py-1">
                  {packName}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {/* FIXED: Added : any type here to satisfy Vercel Build */}
                  {groupedStickers[packName].map((sticker: any) => (
                    <button
                      key={sticker.id}
                      onClick={() => addToCart({
                        id: `single-${sticker.id}`,
                        title: `${packName} #${sticker.sticker_number}`,
                        price: sticker.price_tier === 'small' ? 'Rs. 35' : 'Rs. 50',
                        image_url: sticker.image_url,
                        isSingle: true,
                        stickerNumber: sticker.sticker_number,
                        packName: packName
                      })}
                      className="group relative aspect-square bg-white border-2 md:border-4 border-brand-black p-1 hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] overflow-hidden"
                    >
                      <img 
                        src={sticker.image_url} 
                        alt={`Sticker ${sticker.sticker_number}`} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-0 right-0 bg-brand-black text-white text-[10px] font-bold px-1.5 py-0.5">
                        #{sticker.sticker_number}
                      </div>
                      <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}