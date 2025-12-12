'use client'



import { X, MessageCircle, Trash2 } from 'lucide-react'

import { useCart } from '@/context/CartContext'



export default function CartSidebar() {

  // Added 'clearCart' to the list of tools we get from the context

  const { cartItems, isCartOpen, toggleCart, removeFromCart, clearCart, getSubtotal } = useCart()



  const subtotal = getSubtotal()



  const handleCheckout = () => {

    const phoneNumber = '94721717874'



    let message = 'Yo Mixtape Era! 📼 I want to secure these drops:\n\n'

    message += '--------------------------------\n'

   

    cartItems.forEach((item) => {

      message += `• ${item.quantity} x ${item.title} - ${item.price}\n`

    })

   

    message += '--------------------------------\n'

    message += `TOTAL: ${subtotal.toFixed(2)}\n\n`

    message += 'Let me know payment details!'

   

    const encodedMessage = encodeURIComponent(message)

   

    // 1. Open WhatsApp

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')



    // 2. Empty the cart immediately after

    clearCart()

  }



  return (

    <div

      className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-cream border-l-4 border-brand-black z-50 transform transition-transform duration-300 ease-in-out ${

        isCartOpen ? 'translate-x-0' : 'translate-x-full'

      }`}

    >

      <div className="flex flex-col h-full">

        <div className="border-b-4 border-brand-black bg-white p-6 flex items-center justify-between">

          <h2 className="text-3xl font-black uppercase">YOUR STASH</h2>

          <button

            onClick={toggleCart}

            className="w-10 h-10 border-2 border-brand-black bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/80 transition-colors"

          >

            <X className="w-5 h-5" />

          </button>

        </div>



        <div className="flex-1 overflow-y-auto p-6">

          {cartItems.length === 0 ? (

            <div className="text-center py-12">

              <p className="text-xl font-bold text-gray-500">Your stash is empty</p>

            </div>

          ) : (

            <div className="space-y-4">

              {cartItems.map((item) => (

                <div key={item.id} className="bg-white border-4 border-brand-black p-4 relative group">

                  <div className="flex gap-4 mb-3">

                    <div className="w-20 h-20 border-2 border-brand-black overflow-hidden flex-shrink-0">

                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />

                    </div>

                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold uppercase text-sm mb-1 truncate">{item.title}</h3>

                      <p className="text-brand-red font-mono font-bold text-sm">{item.price}</p>

                      <div className="flex items-center gap-2 mt-2">

                        <span className="text-xs font-bold text-gray-600">Qty: {item.quantity}</span>

                      </div>

                    </div>

                    <button

                      onClick={() => removeFromCart(item.id)}

                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 transition-colors"

                      title="Remove Item"

                    >

                      <Trash2 className="w-4 h-4" />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>



        {cartItems.length > 0 && (

          <div className="border-t-4 border-brand-black bg-white p-6">

            <div className="flex justify-between items-center mb-4">

              <span className="text-xl font-bold uppercase">Subtotal</span>

              <span className="text-2xl font-black font-mono text-brand-red">

                {subtotal.toFixed(2)}

              </span>

            </div>

            <button

              onClick={handleCheckout}

              className="w-full bg-brand-red border-4 border-brand-black py-4 font-black uppercase text-xl tracking-widest hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] transition-all flex items-center justify-center gap-2"

            >

              <MessageCircle className="w-6 h-6" />

              CHECKOUT

            </button>

          </div>

        )}

      </div>

    </div>

  )

}