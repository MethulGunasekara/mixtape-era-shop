'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation'; // <--- 1. Import Router
import { Pencil, Trash2, X, Plus, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
  description: string;
  badge_text: string | null;
  badge_type: string | null;
  gallery: string[];
}

export default function Dashboard() {
  const router = useRouter(); // <--- 2. Initialize Router
  
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); 
  const [galleryLines, setGalleryLines] = useState('');
  const [description, setDescription] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeType, setBadgeType] = useState('none');
  
  // App State
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- 3. THE SECURITY CHECK ---
  useEffect(() => {
    const checkUser = async () => {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If not logged in, kick them to the login page
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    if (data) setProducts(data);
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setImage('');
    setGalleryLines('');
    setDescription('');
    setBadgeText('');
    setBadgeType('none');
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setImage(product.image_url || '');
    setGalleryLines(product.gallery ? product.gallery.join('\n') : '');
    setDescription(product.description || '');
    setBadgeText(product.badge_text || '');
    setBadgeType(product.badge_type || 'none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- UPLOAD FUNCTION (Targets 'stickers' bucket) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        return; 
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('stickers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get Public URL
      const { data } = supabase.storage
        .from('stickers')
        .getPublicUrl(filePath);

      setImage(data.publicUrl);
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this drop?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      fetchProducts();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const galleryArray = galleryLines
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');

    const productData = {
      title,
      price,
      image_url: image,
      gallery: galleryArray,
      description,
      badge_text: badgeText || null,
      badge_type: badgeType,
    };

    let error;

    if (editingId) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);
      error = insertError;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(editingId ? 'Drop Updated!' : 'Drop Published!');
      resetForm();
      fetchProducts();
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono">
      <Navbar />

      <div className="max-w-4xl mx-auto py-20 px-6">
        
        {/* --- FORM SECTION --- */}
        <div className="bg-white border-4 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] mb-12">
          <div className="flex justify-between items-center mb-8 border-b-4 border-brand-black pb-4">
            <h1 className="text-3xl font-black uppercase">
              {editingId ? 'Edit Drop' : 'Upload New Drop'}
            </h1>
            {editingId && (
              <button onClick={resetForm} className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2 uppercase">Product Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold focus:bg-brand-yellow/20 outline-none"
                  placeholder="Ex: Holo Skull"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase">Price</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold focus:bg-brand-yellow/20 outline-none"
                  placeholder="1500"
                  required
                />
              </div>
            </div>

            {/* --- IMAGES SECTION --- */}
            <div className="bg-gray-50 p-6 border-2 border-brand-black border-dashed">
              <h3 className="font-bold uppercase mb-4 text-brand-red flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Images
              </h3>
              
              {/* Main Thumbnail */}
              <div className="mb-6">
                <label className="block font-bold mb-2 uppercase text-sm">Thumbnail / Main Image</label>
                
                <div className="flex gap-4 items-center">
                  {/* The Upload Button */}
                  <div className="relative flex-1 group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full bg-white border-2 border-brand-black p-3 font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                      uploading ? 'bg-gray-200 text-gray-500' : 'group-hover:bg-brand-yellow group-hover:text-brand-black'
                    }`}>
                      <UploadCloud className={`w-5 h-5 ${uploading ? 'animate-bounce' : ''}`} />
                      {uploading ? 'UPLOADING...' : 'CLICK TO UPLOAD FILE'}
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="w-16 h-16 border-2 border-brand-black bg-white flex items-center justify-center overflow-hidden shrink-0 relative">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-300">PRE</span>
                    )}
                  </div>
                </div>

                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full mt-2 bg-transparent border-b-2 border-gray-300 p-2 text-xs font-mono text-gray-500 outline-none focus:border-brand-black placeholder:text-gray-300"
                  placeholder="Or paste image URL manually..."
                  required
                />
              </div>

              {/* Gallery */}
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Gallery Links (One per line)
                </label>
                <textarea 
                  value={galleryLines}
                  onChange={(e) => setGalleryLines(e.target.value)}
                  className="w-full bg-white border-2 border-brand-black p-3 font-bold h-24 focus:bg-brand-yellow/20 outline-none resize-y"
                  placeholder={`To add more images: Upload one above -> Copy the link from the box -> Paste here -> Repeat.`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold mb-2 uppercase">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-100 border-2 border-brand-black p-3 font-bold h-24 focus:bg-brand-yellow/20 outline-none resize-none"
                placeholder="Details about the sticker..."
              />
            </div>

            {/* Promotions Section */}
            <div className="bg-gray-50 p-4 border-2 border-brand-black border-dashed">
              <h3 className="font-bold uppercase mb-4 text-brand-red">Promotions (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-sm uppercase">Badge Type</label>
                  <select 
                    value={badgeType}
                    onChange={(e) => setBadgeType(e.target.value)}
                    className="w-full bg-white border-2 border-brand-black p-3 font-bold outline-none"
                  >
                    <option value="none">None</option>
                    <option value="discount">Discount (% OFF)</option>
                    <option value="offer">Special Offer (Badge)</option>
                  </select>
                </div>
                
                {badgeType !== 'none' && (
                  <div>
                    <label className="block font-bold mb-2 text-sm uppercase">
                      {badgeType === 'discount' ? 'Discount % (Number)' : 'Badge Text'}
                    </label>
                    {badgeType === 'discount' ? (
                      <input 
                        type="number" 
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-white border-2 border-brand-black p-3 font-bold outline-none"
                        placeholder="20"
                      />
                    ) : (
                      <textarea 
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-white border-2 border-brand-black p-3 font-bold outline-none h-[52px] resize-none leading-tight"
                        placeholder="SUPER&#10;DEAL"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || uploading}
              className={`w-full border-2 border-brand-black py-4 font-black uppercase tracking-widest hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] transition-all disabled:opacity-50 ${
                editingId ? 'bg-brand-yellow' : 'bg-brand-red'
              }`}
            >
              {loading ? 'Processing...' : (editingId ? 'UPDATE DROP' : 'PUBLISH DROP')}
            </button>
          </form>
        </div>

        {/* --- INVENTORY LIST SECTION --- */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase border-b-4 border-brand-black pb-2 mb-6">
            Live Inventory ({products.length})
          </h2>
          
          {products.map((product) => (
            <div key={product.id} className="bg-white border-2 border-brand-black p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 border-2 border-brand-black flex-shrink-0 bg-gray-200">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">NO IMG</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold uppercase truncate">{product.title}</h3>
                <p className="text-sm text-brand-red font-mono font-bold">{product.price}</p>
                <div className="flex gap-2 text-xs text-gray-500 font-bold mt-1">
                  {product.gallery && product.gallery.length > 0 && (
                     <span className="flex items-center gap-1"><Plus className="w-3 h-3"/> {product.gallery.length} extra images</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-brand-yellow border-2 border-brand-black hover:bg-brand-green hover:text-white transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-gray-100 border-2 border-brand-black hover:bg-brand-red hover:text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}