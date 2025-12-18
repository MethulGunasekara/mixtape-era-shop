'use client'

import { X, MessageCircle, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartSidebar() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, clearCart, getSubtotal } = useCart()

  const subtotal = getSubtotal()

  const handleCheckout = () => {
    const phoneNumber = '94721717874' 
    let message = 'Yo Mixtape Era! 📼 I want to secure these drops:\n\n'
    message += '--------------------------------\n'
    cartItems.forEach((item) => {
      // Show variant in WhatsApp message if it exists
      const variantText = item.variant && item.variant !== 'Standard' ? `[${item.variant}] ` : ''
      message += `• ${item.quantity} x ${variantText}${item.title} - ${item.price}\n`
    })
    message += '--------------------------------\n'
    message += `TOTAL: ${subtotal.toFixed(2)}\n\n`
    message += 'Let me know payment details!'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
    clearCart()
  }

  return (
    <div
      className={`
        fixed z-50 bg-brand-cream border-brand-black shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
        bottom-0 left-0 w-full h-[60vh] border-t-4 rounded-t-3xl
        ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}
        md:top-0 md:right-0 md:h-full md:w-[400px] md:border-l-4 md:border-t-0 md:rounded-none
        md:${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-y-0'}
      `}
    >
      {/* Header */}
      <div className="border-b-4 border-brand-black bg-white p-4 flex items-center justify-between md:rounded-none rounded-t-3xl">
        <h2 className="text-2xl font-black uppercase">YOUR CART</h2>
        <button
          onClick={toggleCart}
          className="w-8 h-8 md:w-10 md:h-10 border-2 border-brand-black bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/80 transition-colors rounded-full md:rounded-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-brand-cream">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl font-bold text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              // Using index as key backup to avoid collision if id/variant are same (shouldn't happen with addToCart logic though)
              <div key={`${item.id}-${item.variant}-${index}`} className="bg-white border-2 md:border-4 border-brand-black p-3 md:p-4 relative group shadow-sm">
                <div className="flex gap-3 md:gap-4 mb-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-brand-black overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold uppercase text-sm mb-1 truncate">{item.title}</h3>
                    {/* Show Variant Name */}
                    {item.variant && item.variant !== 'Standard' && (
                       <span className="inline-block bg-gray-100 border border-brand-black px-1 text-[10px] font-bold uppercase mb-1">
                         {item.variant}
                       </span>
                    )}
                    <p className="text-brand-red font-mono font-bold text-sm">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-gray-600">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <button 
                    // FIXED: Now passing variant to remove function
                    onClick={() => removeFromCart(item.id, item.variant)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Checkout */}
      {cartItems.length > 0 && (
        <div className="border-t-4 border-brand-black bg-white p-4 md:p-6 pb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold uppercase">Subtotal</span>
            <span className="text-2xl font-black font-mono text-brand-red">
              {subtotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-brand-red border-4 border-brand-black py-3 md:py-4 font-black uppercase text-lg md:text-xl tracking-widest hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] transition-all flex items-center justify-center gap-2 text-white"
          >
            <MessageCircle className="w-6 h-6" />
            CHECKOUT
          </button>
        </div>
      )}
    </div>
  )
}