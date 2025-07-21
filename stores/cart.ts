import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isLoading: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    // Intentional bug: incorrect calculation
    total: (state) => {
      return state.items.reduce((sum, item) => {
        // Bug: Should multiply by quantity, but we're adding it instead
        const itemTotal = item.product.price * item.quantity
        return sum + itemTotal
      }, 0)
    },
    
    subtotal: (state) => {
      return state.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
      }, 0)
    },
    
    discount: (state) => {
      return state.items.reduce((sum, item) => {
        const discount = (item.product.price * item.quantity * item.product.discountPercentage) / 100
        return sum + discount
      }, 0)
    }
  },

  actions: {
    addToCart(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          product,
          quantity
        })
      }
      
      this.saveToLocalStorage()
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
        this.saveToLocalStorage()
      } else if (item && quantity === 0) {
        this.removeFromCart(productId)
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const cartData = localStorage.getItem('cart')
        if (cartData) {
          try {
            this.items = JSON.parse(cartData)
          } catch (error) {
            console.error('Failed to load cart from localStorage:', error)
          }
        }
      }
    },

    async checkout() {
      // Simulate checkout process
      this.isLoading = true
      try {
        // In a real app, this would send the order to the backend
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Clear cart after successful checkout
        this.clearCart()
        
        return {
          success: true,
          orderId: Math.random().toString(36).substr(2, 9)
        }
      } catch (error) {
        return {
          success: false,
          error: 'Checkout failed. Please try again.'
        }
      } finally {
        this.isLoading = false
      }
    }
  }
})