'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  id: number
  title: string
  price: string
  image_url: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  // NEW: Function to wipe the cart
  clearCart: () => void 
  toggleCart: () => void
  updateQuantity: (id: number, quantity: number) => void
  getTotalItems: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load
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

  // Save
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mixtape-cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // --- NEW: The Clear Function ---
  const clearCart = () => {
    setCartItems([]) // Wipe state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mixtape-cart') // Wipe hard drive
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
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
        clearCart, // Export it here
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