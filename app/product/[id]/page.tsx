'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useParams } from 'next/navigation';
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Variant {
  name: string;
  price: string;
  image_url: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive State
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [displayImage, setDisplayImage] = useState('');
  const [displayPrice, setDisplayPrice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) {
        setProduct(data);
        // Initialize with the first variant (lowest price usually)
        if (data.variants && data.variants.length > 0) {
          const firstVar = data.variants[0];
          setSelectedVariant(firstVar);
          setDisplayImage(firstVar.image_url);
          setDisplayPrice(firstVar.price);
        } else {
          // Fallback if no variants
          setDisplayImage(data.image_url);
          setDisplayPrice(data.price);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleVariantClick = (variant: Variant) => {
    setSelectedVariant(variant);
    setDisplayImage(variant.image_url);
    setDisplayPrice(variant.price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    addToCart({
      id: product.id,
      title: product.title,
      price: displayPrice,
      image_url: displayImage,
      variant: selectedVariant ? selectedVariant.name : 'Standard'
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-brand-black" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center text-xl font-bold">
      Product not found.
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-bold mb-8 hover:text-brand-red transition-colors">
          <ArrowLeft className="w-5 h-5" /> BACK TO DROPS
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT: Dynamic Image */}
          <div className="relative">
             <div className="aspect-square bg-white border-4 border-brand-black shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] overflow-hidden flex items-center justify-center">
               <img 
                 src={displayImage} 
                 alt={product.title} 
                 className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
               />
             </div>
          </div>

          {/* RIGHT: Details & Controls */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4">{product.title}</h1>
            
            {/* Dynamic Price */}
            <p className="text-3xl font-mono font-bold text-brand-red mb-8 border-b-4 border-brand-black inline-block pb-1">
              {displayPrice} LKR
            </p>

            {/* --- SELECT TYPE (BUTTONS) --- */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block font-bold uppercase mb-3 text-sm tracking-wider">Select Pack Size:</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: Variant, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleVariantClick(v)}
                      className={`px-6 py-3 border-4 font-bold uppercase transition-all transform hover:-translate-y-1 ${
                        selectedVariant?.name === v.name
                          ? 'bg-brand-black text-white border-brand-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                          : 'bg-white text-brand-black border-brand-black hover:bg-brand-yellow shadow-[4px_4px_0px_0px_rgba(15,15,15,1)]'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
               <label className="block font-bold uppercase mb-2 text-sm text-gray-500">Description</label>
               <p className="whitespace-pre-wrap font-bold text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className={`w-full md:w-auto px-12 py-5 border-4 border-brand-black font-black uppercase text-xl tracking-widest shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 ${
                isAdding ? 'bg-brand-green text-white' : 'bg-brand-red text-white'
              }`}
            >
              {isAdding ? (
                <>ADDED TO STASH ✓</>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" /> ADD TO STASH
                </>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </main>
  );
}