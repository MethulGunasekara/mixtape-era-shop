'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, X, Image as ImageIcon, UploadCloud, Layers, Loader2, Plus, Hash, Tag } from 'lucide-react';

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
  variants: Variant[];
}

interface Sticker {
  id: number;
  pack_name: string;
  sticker_number: number;
  image_url: string;
  price_tier: 'small' | 'general';
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'drops' | 'singles'>('drops');
  
  // Security Check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkUser();
  }, [router]);

  // --- DROPS STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeType, setBadgeType] = useState('none');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [vName, setVName] = useState('');
  const [vPrice, setVPrice] = useState('');
  const [vImage, setVImage] = useState('');
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingVariant, setUploadingVariant] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- SINGLES STATE ---
  const [sPackName, setSPackName] = useState('');
  const [sNumber, setSNumber] = useState('');
  const [sImage, setSImage] = useState('');
  const [sPriceTier, setSPriceTier] = useState<'small' | 'general'>('general');
  const [uploadingSticker, setUploadingSticker] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchStickers();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchStickers = async () => {
    const { data } = await supabase.from('stickers').select('*').order('pack_name', { ascending: true }).order('sticker_number', { ascending: true });
    if (data) setStickers(data);
  };

  // --- IMAGE HELPERS ---
  const uploadToStorage = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('stickers').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('stickers').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingMain(true);
    try {
      const url = await uploadToStorage(e.target.files[0], 'main');
      setImage(url);
    } catch (err: any) { alert(err.message); }
    finally { setUploadingMain(false); }
  };

  const handleStickerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingSticker(true);
    try {
      const url = await uploadToStorage(e.target.files[0], 'sticker');
      setSImage(url);
    } catch (err: any) { alert(err.message); }
    finally { setUploadingSticker(false); }
  };

  // --- ACTIONS ---
  const handleDropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || variants.length === 0) return alert("Missing image or variants");
    setLoading(true);
    const lowestPrice = [...variants].sort((a,b) => parseFloat(a.price) - parseFloat(b.price))[0].price;
    const data = { title, description, badge_text: badgeText || null, badge_type: badgeType, variants, price: lowestPrice, image_url: image };
    const { error } = editingId ? await supabase.from('products').update(data).eq('id', editingId) : await supabase.from('products').insert([data]);
    if (!error) { fetchProducts(); resetDropForm(); }
    setLoading(false);
  };

  const handleStickerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sImage || !sPackName || !sNumber) return alert("Fill all fields");
    setLoading(true);
    const { error } = await supabase.from('stickers').insert([{
      pack_name: sPackName,
      sticker_number: parseInt(sNumber),
      image_url: sImage,
      price_tier: sPriceTier
    }]);
    if (!error) { fetchStickers(); setSImage(''); setSNumber(''); }
    setLoading(false);
  };

  const resetDropForm = () => {
    setEditingId(null); setTitle(''); setDescription(''); setImage(''); setVariants([]);
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        
        {/* TAB SWITCHER */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('drops')}
            className={`flex-1 py-4 font-black uppercase border-4 border-brand-black transition-all ${activeTab === 'drops' ? 'bg-brand-red text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:bg-gray-50'}`}
          >
            Manage Drops
          </button>
          <button 
            onClick={() => setActiveTab('singles')}
            className={`flex-1 py-4 font-black uppercase border-4 border-brand-black transition-all ${activeTab === 'singles' ? 'bg-brand-yellow translate-x-1 translate-y-1 shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:bg-gray-50'}`}
          >
            Manage Singles
          </button>
        </div>

        {activeTab === 'drops' ? (
          /* --- DROPS FORM --- */
          <div className="space-y-12">
            <div className="bg-white border-4 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]">
              <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-brand-black pb-4">
                {editingId ? 'Edit Drop' : 'Upload New Drop'}
              </h1>
              <form onSubmit={handleDropSubmit} className="space-y-6">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="PRODUCT TITLE" className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold" required />
                
                <div className="flex gap-4 items-center bg-gray-50 p-4 border-2 border-brand-black border-dashed">
                  <div className="relative flex-1">
                    <input type="file" onChange={handleMainImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-full bg-white border-2 border-brand-black p-3 font-black text-center uppercase text-sm">
                      {uploadingMain ? 'UPLOADING...' : 'UPLOAD MAIN THUMBNAIL'}
                    </div>
                  </div>
                  {image && <img src={image} className="w-16 h-16 border-2 border-brand-black object-cover" />}
                </div>

                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="DESCRIPTION" className="w-full bg-gray-100 border-2 border-brand-black p-3 h-24 font-bold" />

                {/* Variants Logic (Same as your old code) */}
                <div className="bg-blue-50 p-4 border-2 border-brand-black">
                    <p className="font-black uppercase mb-4 flex items-center gap-2"><Layers className="w-5 h-5"/> Pack Variants</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                        <input value={vName} onChange={e => setVName(e.target.value)} placeholder="Name (10 Pack)" className="border-2 border-brand-black p-2 text-xs font-bold" />
                        <input value={vPrice} onChange={e => setVPrice(e.target.value)} placeholder="Price (500)" className="border-2 border-brand-black p-2 text-xs font-bold" />
                        <input type="file" onChange={async (e) => {
                            if(e.target.files?.[0]) {
                                setUploadingVariant(true);
                                const url = await uploadToStorage(e.target.files[0], 'var');
                                setVImage(url);
                                setUploadingVariant(false);
                            }
                        }} className="text-[10px]" />
                    </div>
                    <button type="button" onClick={() => {
                        if(vName && vPrice && vImage) setVariants([...variants, {name: vName, price: vPrice, image_url: vImage}]);
                        setVName(''); setVPrice(''); setVImage('');
                    }} className="w-full bg-brand-black text-white text-xs font-bold py-2 uppercase">Add Variant</button>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {variants.map((v, i) => (
                            <div key={i} className="bg-white border-2 border-brand-black p-2 flex items-center gap-2">
                                <span className="text-[10px] font-black">{v.name}</span>
                                <button onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}><X className="w-3 h-3 text-red-500"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-brand-red text-white py-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] border-4 border-brand-black">
                  {loading ? 'SAVING...' : (editingId ? 'UPDATE DROP' : 'PUBLISH DROP')}
                </button>
              </form>
            </div>
            
            {/* Inventory List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase">Current Drops</h2>
                {products.map(p => (
                    <div key={p.id} className="bg-white border-4 border-brand-black p-4 flex items-center gap-4">
                        <img src={p.image_url} className="w-12 h-12 object-cover border-2 border-brand-black" />
                        <div className="flex-1 font-bold uppercase text-sm">{p.title}</div>
                        <div className="flex gap-4">
                            <button onClick={() => {setEditingId(p.id); setTitle(p.title); setVariants(p.variants); setImage(p.image_url); window.scrollTo(0,0);}}><Pencil className="w-5 h-5 text-blue-600"/></button>
                            <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); }}}><Trash2 className="w-5 h-5 text-red-600"/></button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          /* --- SINGLES FORM --- */
          <div className="space-y-12">
            <div className="bg-white border-4 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]">
              <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-brand-black pb-4">Upload Single Sticker</h1>
              <form onSubmit={handleStickerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Pack Name</label>
                        <input value={sPackName} onChange={e => setSPackName(e.target.value)} placeholder="MIXTAPE: VOL. 1" className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold" required />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Sticker #</label>
                        <input type="number" value={sNumber} onChange={e => setSNumber(e.target.value)} placeholder="1" className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold" required />
                    </div>
                </div>

                <div className="flex gap-4 items-center bg-gray-50 p-4 border-2 border-brand-black border-dashed">
                  <div className="relative flex-1">
                    <input type="file" onChange={handleStickerImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-full bg-white border-2 border-brand-black p-3 font-black text-center uppercase text-sm">
                      {uploadingSticker ? 'UPLOADING...' : 'UPLOAD STICKER IMAGE'}
                    </div>
                  </div>
                  {sImage && <img src={sImage} className="w-16 h-16 border-2 border-brand-black object-contain bg-white" />}
                </div>

                <div>
                    <label className="block text-xs font-black uppercase mb-1">Price Tier</label>
                    <select 
                        value={sPriceTier} 
                        onChange={e => setSPriceTier(e.target.value as 'small' | 'general')}
                        className="w-full border-2 border-brand-black p-3 font-black uppercase bg-white"
                    >
                        <option value="general">General (Rs. 50)</option>
                        <option value="small">Small (Rs. 35)</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-brand-yellow text-brand-black py-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] border-4 border-brand-black">
                  {loading ? 'SAVING...' : 'PUBLISH STICKER'}
                </button>
              </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase">Singles Library</h2>
                <div className="grid grid-cols-1 gap-2">
                    {stickers.map(s => (
                        <div key={s.id} className="bg-white border-2 border-brand-black p-3 flex items-center gap-4">
                            <img src={s.image_url} className="w-10 h-10 object-contain border border-brand-black bg-gray-50" />
                            <div className="flex-1 font-bold uppercase text-[10px] md:text-xs">
                                {s.pack_name} <span className="text-brand-red ml-2">#{s.sticker_number}</span>
                                <span className={`ml-4 px-2 py-0.5 border border-brand-black ${s.price_tier === 'small' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                    {s.price_tier === 'small' ? 'RS. 35' : 'RS. 50'}
                                </span>
                            </div>
                            <button onClick={async () => { if(confirm('Delete Sticker?')) { await supabase.from('stickers').delete().eq('id', s.id); fetchStickers(); }}}><Trash2 className="w-4 h-4 text-red-600"/></button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}