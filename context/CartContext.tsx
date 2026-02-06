'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string | number
  title: string
  price: string
  image_url: string
  quantity: number
  variant?: string
  // --- NEW FIELDS FOR SINGLES ---
  isSingle?: boolean
  stickerNumber?: number | string
  packName?: string
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string | number, variant?: string, stickerNumber?: number | string) => void
  clearCart: () => void 
  toggleCart: () => void
  updateQuantity: (id: string | number, variant?: string, stickerNumber?: number | string, quantity?: number) => void
  getTotalItems: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('mixtape-cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mixtape-cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      // Find item with matching ID, Variant, AND Sticker Number
      const existingItem = prevItems.find((item) => 
        item.id === product.id && 
        item.variant === product.variant && 
        item.stickerNumber === product.stickerNumber
      )

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id === product.id && 
           item.variant === product.variant && 
           item.stickerNumber === product.stickerNumber)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string | number, variant?: string, stickerNumber?: number | string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.id === id && item.variant === variant && item.stickerNumber === stickerNumber)
      )
    )
  }

  const clearCart = () => {
    setCartItems([]) 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mixtape-cart') 
    }
  }

  const updateQuantity = (id: string | number, variant?: string, stickerNumber?: number | string, quantity: number = 1) => {
    if (quantity <= 0) {
      removeFromCart(id, variant, stickerNumber)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => 
        (item.id === id && item.variant === variant && item.stickerNumber === stickerNumber) 
        ? { ...item, quantity } : item
      )
    )
  }

  const toggleCart = () => setIsCartOpen((prev) => !prev)

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0)

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Handles strings like "Rs. 500" or "500.00"
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
      return total + priceValue * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        updateQuantity,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}