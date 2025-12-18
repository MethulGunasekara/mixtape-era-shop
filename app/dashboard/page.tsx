'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, X, Plus, Image as ImageIcon, UploadCloud, Layers } from 'lucide-react';

interface Variant {
  name: string;
  price: string;
  image_url: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
  description: string;
  badge_text: string | null;
  badge_type: string | null;
  gallery: string[];
  variants: Variant[]; // New Column
}

export default function Dashboard() {
  const router = useRouter();
  
  // Product State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeType, setBadgeType] = useState('none');
  const [galleryLines, setGalleryLines] = useState('');
  
  // --- VARIANT STATE ---
  const [variants, setVariants] = useState<Variant[]>([]);
  const [vName, setVName] = useState('');
  const [vPrice, setVPrice] = useState('');
  const [vImage, setVImage] = useState('');
  const [uploadingVariant, setUploadingVariant] = useState(false);

  // App State
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Security
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    if (data) setProducts(data);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setGalleryLines('');
    setBadgeText('');
    setBadgeType('none');
    setVariants([]);
    setVName('');
    setVPrice('');
    setVImage('');
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setDescription(product.description || '');
    setGalleryLines(product.gallery ? product.gallery.join('\n') : '');
    setBadgeText(product.badge_text || '');
    setBadgeType(product.badge_type || 'none');
    // Load variants if they exist
    if (product.variants && Array.isArray(product.variants)) {
      setVariants(product.variants);
    } else {
      // Legacy support: Create one variant from the main data
      setVariants([{
        name: 'Standard',
        price: product.price,
        image_url: product.image_url
      }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- VARIANT IMAGE UPLOADER ---
  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingVariant(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `var-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('stickers').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('stickers').getPublicUrl(fileName);
      setVImage(data.publicUrl);
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploadingVariant(false);
    }
  };

  const addVariant = () => {
    if (!vName || !vPrice || !vImage) {
      alert("Please fill in Name, Price and Image for the variant.");
      return;
    }
    setVariants([...variants, { name: vName, price: vPrice, image_url: vImage }]);
    setVName('');
    setVPrice('');
    setVImage('');
  };

  const removeVariant = (index: number) => {
    const newVars = [...variants];
    newVars.splice(index, 1);
    setVariants(newVars);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (variants.length === 0) {
      alert("Please add at least one variant type (e.g. 10 Stickers).");
      return;
    }
    setLoading(true);

    // 1. Calculate Main Price (Lowest) and Main Image (First one)
    const sortedVariants = [...variants].sort((a, b) => 
      parseFloat(a.price) - parseFloat(b.price)
    );
    const mainPrice = sortedVariants[0].price; // Lowest price
    const mainImage = variants[0].image_url;   // Use first variant as cover

    const galleryArray = galleryLines.split('\n').map(u => u.trim()).filter(u => u !== '');

    const productData = {
      title,
      description,
      badge_text: badgeText || null,
      badge_type: badgeType,
      gallery: galleryArray,
      variants: variants, // Save the array
      price: mainPrice,   // Auto-set for frontend sorting
      image_url: mainImage // Auto-set for frontend display
    };

    let error;
    if (editingId) {
      const { error: uErr } = await supabase.from('products').update(productData).eq('id', editingId);
      error = uErr;
    } else {
      const { error: iErr } = await supabase.from('products').insert([productData]);
      error = iErr;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(editingId ? 'Updated!' : 'Published!');
      resetForm();
      fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this drop?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        
        <div className="bg-white border-4 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] mb-12">
          <div className="flex justify-between items-center mb-8 border-b-4 border-brand-black pb-4">
            <h1 className="text-3xl font-black uppercase">{editingId ? 'Edit Drop' : 'Upload Drop'}</h1>
            {editingId && (
              <button onClick={resetForm} className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleUpload} className="space-y-8">
            {/* 1. Basic Info */}
            <div>
              <label className="block font-bold mb-2 uppercase">Product Title</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold focus:bg-brand-yellow/20 outline-none"
                placeholder="Ex: Holo Skull" required
              />
            </div>

            {/* 2. VARIANTS MANAGER (The New Core Feature) */}
            <div className="bg-blue-50 p-6 border-2 border-brand-black">
              <h3 className="font-bold uppercase mb-4 text-brand-black flex items-center gap-2">
                <Layers className="w-5 h-5" /> Product Types / Sizes
              </h3>
              
              {/* Add Variant Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                  placeholder="Name (e.g. 10 Pack)" 
                  value={vName} onChange={e => setVName(e.target.value)}
                  className="bg-white border-2 border-brand-black p-2 text-sm font-bold"
                />
                <input 
                  placeholder="Price (e.g. 1500)" 
                  type="number"
                  value={vPrice} onChange={e => setVPrice(e.target.value)}
                  className="bg-white border-2 border-brand-black p-2 text-sm font-bold"
                />
                <div className="relative group">
                   <input type="file" onChange={handleVariantImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                   <div className={`w-full h-full bg-white border-2 border-brand-black p-2 flex items-center justify-center text-xs font-bold ${vImage ? 'text-green-600' : 'text-gray-400'}`}>
                     {uploadingVariant ? 'Uploading...' : (vImage ? 'Image Set ✓' : 'Upload Image')}
                   </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={addVariant}
                disabled={uploadingVariant}
                className="w-full bg-brand-black text-white font-bold uppercase py-2 hover:bg-gray-800 transition-colors mb-6 text-sm"
              >
                + Add This Type
              </button>

              {/* Variant List */}
              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 border-2 border-brand-black">
                    <img src={v.image_url} className="w-10 h-10 object-cover border border-brand-black"/>
                    <div className="flex-1">
                      <p className="font-bold text-sm uppercase">{v.name}</p>
                      <p className="text-xs font-mono text-brand-red">{v.price}</p>
                    </div>
                    <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {variants.length === 0 && <p className="text-sm text-gray-500 italic text-center">No types added yet. Add at least one.</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold mb-2 uppercase">Description</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold h-24 focus:bg-brand-yellow/20 outline-none resize-none"
                placeholder="Details about the sticker..."
              />
            </div>

            {/* Extra Gallery */}
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Extra Gallery Links (Optional)</label>
              <textarea 
                value={galleryLines} onChange={(e) => setGalleryLines(e.target.value)}
                className="w-full bg-gray-100 border-2 border-brand-black p-3 font-mono text-xs h-20"
                placeholder="One URL per line..."
              />
            </div>

            {/* Promotions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 text-sm uppercase">Badge</label>
                <select value={badgeType} onChange={e => setBadgeType(e.target.value)} className="w-full border-2 border-brand-black p-2 font-bold">
                  <option value="none">None</option>
                  <option value="discount">Discount</option>
                  <option value="offer">Offer</option>
                </select>
              </div>
              {badgeType !== 'none' && (
                <div>
                   <label className="block font-bold mb-2 text-sm uppercase">Text/Value</label>
                   <input value={badgeText} onChange={e => setBadgeText(e.target.value)} className="w-full border-2 border-brand-black p-2 font-bold" />
                </div>
              )}
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full border-2 border-brand-black py-4 font-black uppercase tracking-widest hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] transition-all ${editingId ? 'bg-brand-yellow' : 'bg-brand-red'}`}
            >
              {loading ? 'Saving...' : (editingId ? 'UPDATE DROP' : 'PUBLISH DROP')}
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase border-b-4 border-brand-black pb-2 mb-6">Inventory</h2>
          {products.map((p) => (
            <div key={p.id} className="bg-white border-2 border-brand-black p-4 flex items-center gap-4">
              <img src={p.image_url} className="w-12 h-12 object-cover border-2 border-brand-black" />
              <div className="flex-1">
                <h3 className="font-bold uppercase text-sm">{p.title}</h3>
                <p className="text-xs text-gray-500 font-bold">{p.variants ? p.variants.length : 1} Types • Start: {p.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)}><Pencil className="w-4 h-4 text-blue-600" /></button>
                <button onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}