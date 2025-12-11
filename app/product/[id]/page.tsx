'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  title: string;
  price: string;
  description: string | null;
  image_url: string;
  gallery: string[] | null;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (data) {
        setProduct(data);
        setSelectedImage(data.image_url);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl font-bold">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl font-bold">Product not found</p>
        </div>
      </main>
    );
  }

  const galleryImages = product.gallery || [];
  const allImages = [product.image_url, ...galleryImages];

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Side - Image Gallery */}
          <div>
            {/* Large Main Image */}
            <div className="bg-white border-4 border-brand-black mb-4 aspect-square overflow-hidden">
              <img 
                src={selectedImage} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 border-4 ${
                      selectedImage === imageUrl 
                        ? 'border-brand-red' 
                        : 'border-brand-black'
                    } bg-white overflow-hidden hover:opacity-80 transition-opacity`}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="flex flex-col justify-center">
            <div className="bg-white border-4 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]">
              <h1 className="text-5xl font-black uppercase mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-brand-red mb-8 font-mono">{product.price}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-brand-black pb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description provided.'}
                </p>
              </div>

              <button 
                onClick={() => {
                  if (product) {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image_url: product.image_url,
                    });
                  }
                }}
                className="w-full bg-brand-red border-4 border-brand-black py-4 font-black uppercase text-xl tracking-widest hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] transition-all"
              >
                ADD TO CART
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

