'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  id: number
  title: string
  price: string
  image_url: string
  quantity: number
  variant?: string // <--- NEW: Tracks which type (e.g. "10 Stickers")
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number, variant?: string) => void // Updated signature
  clearCart: () => void 
  toggleCart: () => void
  updateQuantity: (id: number, variant: string | undefined, quantity: number) => void // Updated signature
  getTotalItems: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from LocalStorage
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

  // Save to LocalStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mixtape-cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // ADD TO CART (Now checks Variant too)
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      // Find item with matching ID AND Matching Variant
      const existingItem = prevItems.find((item) => 
        item.id === product.id && item.variant === product.variant
      )

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id === product.id && item.variant === product.variant)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
    setIsCartOpen(true)
  }

  // REMOVE (Checks Variant)
  const removeFromCart = (id: number, variant?: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === id && item.variant === variant))
    )
  }

  const clearCart = () => {
    setCartItems([]) 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mixtape-cart') 
    }
  }

  // UPDATE QTY (Checks Variant)
  const updateQuantity = (id: number, variant: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, variant)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => 
        (item.id === id && item.variant === variant) ? { ...item, quantity } : item
      )
    )
  }

  const toggleCart = () => setIsCartOpen((prev) => !prev)

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0)

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
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